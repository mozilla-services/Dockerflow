# mozlog

mozlog is JSON schema for a common application logging format. By standardizing on a specific format it is easier to write parsers, extractors and aggregators for logs. It is a Mozilla Cloud Services standard and is reproduced here for ease of reference. 

A mozlog message looks like this:

```
{
	"Timestamp": 145767775123456,
	"Type": "request.summary",
	"Logger": "myapp",
	"Hostname": "server-a123.mozilla.org",
	"EnvVersion":"2.0",
	"Severity": 6,
	"Pid": 1337,
	"Fields":{
		"agent": "curl/7.43.0",
		"errno": 0,
		"method": "GET",
		"msg": "the user wanted something.",
		"path": "/something",
		"t": 145767775000,
		"uid": "12345"
	}
}
```

## Top Level Properties

| Name  | Type  | Description  | Required  | Notes  |
|---|---|---|---|---|
| Timestamp  | int64  |  Number of nanoseconds since the UNIX epoch  | required | If human readable time is absolutely necessary, add an additional "Time" field that complies to [RFC3339](https://tools.ietf.org/html/rfc3339#section-5.8) |
| Type  | string | Type of message i.e. “request.summary” | recommended |   |
| Logger  | string | Data source that is creating the log, ie: docker | recommended |   |
| Hostname  | string | Hostname that generated the message | recommended |  |
| EnvVersion  | string | Envelope version; log format version | recommended | Use: "2.0"  |
| Pid  | int32 | Process ID that generated the message | optional |   |
| Severity  | int32 | [syslog severity level](https://en.wikipedia.org/wiki/Syslog#Severity_level)  | optional |   |
| Fields | object | hash of fields  | recommended | see example below |

## `Fields` property

The `Fields` property can be a multi-dimensional hash of fields. For example: 

```
{ ... 
  "Fields": {
    "name": "a string",
    "age" : 123,
    "points": [1,2, "three", {"num": 4.0} ],
    "address": {
      "street": ...
    }    
  }
}
```

It is recommended to keep things conservative. While you do not need to use a flat hash, having too many levels makes parsing slow and extracting data more difficult. 

### Application Request Summary (Type: "request.summary")

For http requests it is recommended to include these common fields in a single log message rather than spread them over several individual log messages. 

| Field Name | Type | Description | Required | PII[1] | Notes }
|---|---|---|---|---|---|
| agent | string | User agent string: stack overflow summary | recommended | can be; will be parsed into `user_agent_browser` , `user_agent_os`, `user_agent_version` for common user agents and then scrubbed by the pii filter | imprortant for device/desktop segmentations, which are derived from this field. |
| context | string | Does this request have different contexts it might be coming from? (e.g. "first time experience" vs. "settings panel") | recommended if appropriate |   | Can be useful for understanding how users are using services. |
| email | string | email used in this request | discouraged | yes; will be scrubbed by pii filter before being indexed | Some servers need this to be logged (fraud detection, etc.); only log email addresses if you have a specific need. |
| errno | int32 | 0 for success or a number > 0 for errors, defined by the application | recommended |  | use HTTP error response code, e.g. 404, 503, etc |
| lang | string | the parsed 'accept-language' | recommended | can be for unusual locales/languages | We're also interested in aggregated language segmentations; to detect problems with translations and to understand popularity of services in different areas. |
| method |   | request method | recommended if important to distinguish API calls |   |  |
| msg | string | Human readable string (often error string) | optional | should not contain pii | Generally not parsed by heka/kibana |
| path |   | request path | recommended |   |  |
| remoteAddressChain | string array | array of IP addresses between the client and server | optional | yes; will be scrubbed by pii filter before being indexed in es |  |
| rid | string | unique request id for correlating other log lines | optional |   |  |
| service | string | If this server is used by multiple cloud services, which service? | recommended if appropriate | can be (in particular if non-mozilla services enter the mix). Not filtering yet but we may need to eventually. | This field is important for looking at how frequently various services are being used, what services are on-ramps to accounts, etc. Over time this is going to become a very important segmentation. |
| t | int32 | request processing time in ms | optional |   |  |
| uid | string | user id | recommended | yes; will be scrubbed by pii filter before being indexed in es | This field is often very important for "daily active user" counts (and similar). These counts are usually computed by heka filters before pii scrubbing. |	 

[1] How to handle Personally Identifiable Information.

## Implementations

* [nodejs](https://www.npmjs.com/package/mozlog)
* [golang](https://github.com/mozilla-services/go-mozlog)
* Python ...
