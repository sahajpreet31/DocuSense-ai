import re
from collections import Counter

from services.embeddings import get_all_chunks

STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "if", "then", "else", "for", "to", "of", "in", "on",
    "at", "by", "with", "from", "as", "is", "are", "was", "were", "be", "been", "being", "this",
    "that", "these", "those", "it", "its", "he", "she", "they", "them", "his", "her", "their",
    "we", "us", "our", "you", "your", "i", "my", "me", "not", "no", "do", "does", "did", "have",
    "has", "had", "will", "would", "shall", "should", "can", "could", "may", "might", "must",
    "there", "here", "all", "any", "each", "other", "such", "than", "so", "very", "just", "also",
    "into", "about", "between", "after", "before", "over", "under", "out", "up", "down", "off",
    "again", "further", "once", "more", "most", "some", "what", "which", "who", "whom", "when",
    "where", "why", "how", "both", "few", "only", "own", "same", "too",
}

WORD_RE = re.compile(r"[A-Za-z']+")
SENTENCE_RE = re.compile(r"[.!?]+")
VOWEL_GROUP_RE = re.compile(r"[aeiouy]+")

WORDS_PER_MINUTE = 200


def extract_words(text):
    return WORD_RE.findall(text)


def count_sentences(text):
    sentences = [s for s in SENTENCE_RE.split(text) if s.strip()]
    return max(len(sentences), 1)


def count_syllables(word):
    word = word.lower()
    vowel_groups = VOWEL_GROUP_RE.findall(word)
    syllables = len(vowel_groups)

    if word.endswith("e") and syllables > 1:
        syllables -= 1

    return max(syllables, 1)


def top_words(words, limit=10):
    filtered = [w.lower() for w in words if w.lower() not in STOP_WORDS and len(w) > 1]
    counts = Counter(filtered)
    return [{"word": word, "count": count} for word, count in counts.most_common(limit)]


def flesch_kincaid_score(word_count, sentence_count, syllable_count):
    if word_count == 0 or sentence_count == 0:
        return 0.0

    score = (
        206.835
        - 1.015 * (word_count / sentence_count)
        - 84.6 * (syllable_count / word_count)
    )
    return round(score, 1)


def readability_label(score):
    if score >= 60:
        return "Easy"
    if score >= 40:
        return "Medium"
    if score >= 20:
        return "Hard"
    return "Very Hard"


def analyze_text(text):
    words = extract_words(text)
    word_count = len(words)
    sentence_count = count_sentences(text)
    syllable_count = sum(count_syllables(w) for w in words)

    avg_words_per_sentence = round(word_count / sentence_count, 1) if sentence_count else 0
    reading_time_minutes = max(round(word_count / WORDS_PER_MINUTE), 1) if word_count else 0
    readability_score = flesch_kincaid_score(word_count, sentence_count, syllable_count)

    return {
        "word_count": word_count,
        "sentence_count": sentence_count,
        "avg_words_per_sentence": avg_words_per_sentence,
        "reading_time_minutes": reading_time_minutes,
        "readability_score": readability_score,
        "readability_label": readability_label(readability_score),
        "top_words": top_words(words),
    }


def analyze_document(document_id):
    chunks = get_all_chunks(document_id)
    if not chunks:
        raise ValueError("No content found for this document_id")

    return analyze_text(" ".join(chunks))
