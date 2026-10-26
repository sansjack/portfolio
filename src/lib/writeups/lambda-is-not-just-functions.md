---
title: Lambda finally grew up
date: 2026-10-26
summary: Web Functions, MicroVMs, Durable Functions and Managed Instances. Everything I wanted from Lambda about five years ago.
---

The 15 minute cap always seemed reasonable. Right up until it wasn't.

I once worked on a system where years of developers had found it far too easy to keep adding "just one more step" to a single Lambda. It got so big it was painful to pull apart, and it was forever timing out at 15 minutes. We did eventually split it up, but it was a slog. And don't get me started on package handling inside Lambdas, or the cold starts.

So when AWS announced that Lambda is no longer one thing, I read the whole post with a very big grin.

## Event Functions

This is just the Lambda we already know, with a new name. An event comes in, one environment handles it, and you pay for wall-clock time. Once a service starts doing everything, the original needs a label.

## Web Functions

This is the one I'm most excited about. Your code is a normal HTTP server listening on a port. Hono, Express, Fastify or Next.js all work, with no adapters. Lambda tells your server where to bind through `AWS_LAMBDA_HTTP_ENDPOINT`, and you deploy with one command:

```bash
aws lambda-web deploy --name my-web-app --code ./my-app --regions us-east-1,eu-west-1
```

There are two big changes:

- **Multi-concurrency.** One warm environment handles up to 128 requests at once, so bursts share warm environments instead of each spawning a new one. That fixes a lot of my cold start pain.
- **Active CPU billing.** You pay for CPU time actually used, plus memory while the environment exists. Waiting 25 seconds for a model to stream tokens back costs you almost nothing.

You also get immutable revisions with weighted traffic splitting (a 90/10 canary is one setting) and CloudFront in front with OAC.

The fine print matters, though. At launch it's Node.js 24 on Arm64 only, in five regions, and the cross-region routing is "best-effort". It's early days.

## MicroVMs

A proper Firecracker VM with its own OS, disk and HTTPS endpoint (HTTP/2, gRPC and WebSockets). *You* decide when it lives and dies.

Let an agent install packages and write files, suspend it when the user wanders off, and resume it later with memory and disk intact. It's a pet VM, on Lambda. Five years ago I'd have laughed at that sentence.

## Durable Functions

Remember my 15 minute timeout story? This is the proper answer to it. Durable Functions checkpoint your progress, so a function can pause for a callback or a human approval and pay nothing while it waits. It can then resume where it left off, up to a year later. Each step is explicit, so you can't quietly pile everything into one giant handler.

## The rest

**Managed Instances** run your Lambda on EC2 inside your own VPC, with Graviton, longer timeouts and Savings Plans. It's the escape hatch for when the bill gets scary.

**Tenant isolation** is tiny but sensible. You pass a tenant ID when you invoke, and Lambda never reuses that tenant's environment for anyone else. That's a whole class of "separate function per customer" workarounds gone.

## So... is it really serverless?

Look at the list: it listens on a port, keeps state on a disk, sleeps for hours, and can run on instances in my own account. It's fair to ask.

I think it still is, and the answer is that it simply makes more sense now. Standalone, pure serverless has its place, but that place is a small corner of what people build. People are building fast and building vast, and these changes will help the 90% who just want to ship without running servers.

I'm also pretty sure I'm not the only one who thinks we needed all of this five years ago. :D
