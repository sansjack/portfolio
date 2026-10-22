---
title: From a Discord reply to a Shortcut ticket comment
date: 2024-01-11
summary: Reply in Discord, comment on a Shortcut ticket, trigger Make.
---

Teams talk in Discord and track work in a ticket board. The two rarely meet, so details get lost. This project closes that gap: reply to a message in Discord, and it becomes a comment on a ticket.

## The goal

The client wanted a Discord bot that adds comments to tickets on [shortcut.com](https://shortcut.com), using **slash commands** from their own server. Two features:

- `/shortcut` sends the message you are **replying to** as the comment.
- `/shortcut <message>` sends a **custom message** you type.

## The quirks

Two things shaped the design.

First, every message should also reach [make.com](https://make.com), so the client can build custom logic and integrations there.

Second, and more annoying: **Discord doesn't support slash commands when replying to a message.** So the reply flow needs a classic prefix command instead, `!shortcut`.

## The architecture

Before anything is sent to Make, we need data from Shortcut: which teams exist and which tickets are available. Once the user has picked one through the bot, the message can go on its way.

![Architecture diagram](https://i.imgur.com/PKSVzyE.png)

## The solution

The two commands:

- `!shortcut` replies to a selected message.
- `/shortcut <message>` passes a custom message.

They share most of their logic, so the code is structured to avoid repeating itself.

For picking a ticket we use `discord.ui` to show a tidy selection menu of the available tickets whenever a command is called. The user's choice tells us where the comment belongs.

Then we set up a **webhook in Make** and `POST` our payload to it. Make receives it and kicks off an event-driven pipeline, with all of the client's custom logic hanging off the end.

The payload looks like this:

```python
@dataclass
class Payload:
    group_id: str
    ticket_id: str
    invocation_discord_id : str
    message_discord_id: str
    message: str
```

## The proof of concept

Here is how the two commands are defined in Python 3.10:

```python
"""
Slash command which takes a custom message to send to shortcut.com
"""
@tree.command(name="shortcut")
@describe(message="message to send to shortcut")
async def shortcut(interaction, message):
    # gets users input and sends to shortcut

"""
Regular bot command which will take the message you replied to and send it to shortcut.com
"""
@bot.command()
async def shortcut(ctx):
    if ctx.message.reference is None:
        await ctx.send("You have not replied to a message!")
        return None
```

---

The result: a conversation in Discord, a comment on the ticket, and an automation pipeline already listening on the other end.
