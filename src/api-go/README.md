# API-Go Profiling with pprof

This document explains how to use pprof to profile the api-go service.

## Overview

The api-go service now includes support for profiling using Go's built-in pprof tool. Profiling helps identify performance bottlenecks, memory leaks, and other issues in the application.

## Configuration

The pprof server is configured in the application's configuration. The following environment variables can be used to configure the pprof server:

- `HAMMERGEN_PPROFSERVER_ENABLED`: Enable or disable the pprof server (default: `false`)
- `HAMMERGEN_PPROFSERVER_PORT`: The port on which the pprof server listens (default: `6060`)

Example:

```bash
# Enable pprof server
export HAMMERGEN_PPROFSERVER_ENABLED=true

# Change pprof server port
export HAMMERGEN_PPROFSERVER_PORT=6061
```

## Accessing pprof Endpoints

When the api-go service is running with pprof enabled, you can access the pprof endpoints at:

```
http://localhost:6060/debug/pprof/
```

The following endpoints are available:

- `/debug/pprof/`: Index page with links to all profiles
- `/debug/pprof/heap`: Heap profile (memory allocations)
- `/debug/pprof/goroutine`: Goroutine profile (active goroutines)
- `/debug/pprof/block`: Block profile (synchronization blocks)
- `/debug/pprof/threadcreate`: Thread creation profile
- `/debug/pprof/cmdline`: Command line arguments
- `/debug/pprof/profile`: CPU profile (30-second sampling by default)
- `/debug/pprof/trace`: Execution trace (1-second sampling by default)

## Using pprof Tool

You can use the `go tool pprof` command to analyze the profiles. Here are some examples:

### CPU Profiling

```bash
# Collect a 30-second CPU profile
go tool pprof http://localhost:6060/debug/pprof/profile
```

### Memory Profiling

```bash
# Collect a heap profile
go tool pprof http://localhost:6060/debug/pprof/heap
```

### Goroutine Profiling

```bash
# Collect a goroutine profile
go tool pprof http://localhost:6060/debug/pprof/goroutine
```

### Interactive Web UI

For a more interactive experience, you can use the `-http` flag to start a web UI:

```bash
# Collect a CPU profile and start a web UI
go tool pprof -http=:8080 http://localhost:6060/debug/pprof/profile
```

This will open a web browser with an interactive visualization of the profile.

## Best Practices

- **Don't enable pprof in production** unless you're actively debugging an issue. It can expose sensitive information and consume additional resources.
- Use short profiling durations in production to minimize impact.
- Focus on one type of profiling at a time (CPU, memory, etc.) to avoid overwhelming the application.
- Compare profiles before and after code changes to identify regressions.

## Further Reading

- [Go pprof documentation](https://golang.org/pkg/net/http/pprof/)
- [Profiling Go Programs](https://blog.golang.org/pprof)