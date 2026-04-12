"""
Utility functions for text processing in SignBridge backend.
"""


def sanitize_text(text: str, max_length: int = 500) -> str:
    """Sanitize and truncate user text input."""
    if not text:
        return ''
    return text.strip()[:max_length]


def format_transcript(messages: list) -> str:
    """Format a list of messages into a readable transcript."""
    lines = []
    for msg in messages:
        sender = 'Deaf User' if msg.get('sender') == 'deaf' else 'Hearing User'
        text = msg.get('text', '')
        lines.append(f"[{sender}]: {text}")
    return '\n'.join(lines)
