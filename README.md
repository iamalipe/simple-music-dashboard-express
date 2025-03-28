# Simple Music Dashboard Express

A simple Express backend for [Simple Music Dashboard](https://github.com/iamalipe/simple-music-dashboard).

We Using ISO 8601 for timestamp.
YYYY-MM-DDTHH:MM:SSZ

- Change log system
- auth
- fast CRUD
- DOC

```json
// return data format
{
    success: boolean,
    message: string,
    data: any,
    errors: { path: string, message: string }[],
    timestamp: string
}

```
