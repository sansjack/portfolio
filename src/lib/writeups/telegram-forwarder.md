---
title: Two Telegram clients and one tiny forwarding bot
date: 2024-07-15
summary: A Python bot that spots one sender's messages and forwards them on.
repo: https://github.com/sansjack/telegram-fwd
---

Sometimes the best automation is a small one. This job started with a single sentence from a client, and it turned into a neat little Telegram project.

## The goal

The client wanted any message sent by a particular bot on Telegram to be **forwarded to them by another bot**, so they could run analysis on it. They also wanted it written in Python 3.

## The solution

[Telethon](https://github.com/LonamiWebs/Telethon) is an asynchronous Python library that can do just about everything we need:

- Log in as a **user**
- Log in as a **bot**
- Listen for events, and filter them
- Send messages

That matters because this job needs **two clients**. A user client acts as the ears, noticing when a message arrives. A bot client acts as the mouth, sending it onward.

With both connected, the `events.NewMessage` handler does the rest. We filter by channel and sender, and when a message matches our edge case, we can do whatever we like with it.

Here, we take the `raw_text` from the event and have the bot client send it on.

> The nice part is the room to grow. Once you have the message in hand, forwarding is just the first thing you could do with it.

## The proof of concept

This is what the event handling looks like:

```python
@user_client.on(
    events.NewMessage(
        incoming=True,
        from_users=Config.USER_TO_LISTEN_TO,
    )
)
async def handler(event: events.NewMessage.Event):
    logger.info(f"Received message: {event.raw_text}")
    await bot_client.send_message(Config.USER_TO_FORWARD_TO, event.raw_text)

    logger.info(f"Forwarded message: {event.raw_text}")
```

A decorator, a filter and one `send_message` call. That's the whole trick.

---

## See the code

The repo has two branches:

- **`main`** is the simple version.
- **`verbose`** adds thorough error handling and a properly managed asynchronous event loop.
