from django.shortcuts import render
from rest_framework import viewsets
from .serializers import SumarticlesSerializer
from .models import Sumarticles
from django.http import HttpResponse
import json
import urllib
import math
from bs4 import BeautifulSoup
from gensim.summarization.summarizer import summarize

# Create your views here.
class SumarticlesView(viewsets.ModelViewSet):
	serializer_class = SumarticlesSerializer
	queryset = Sumarticles.objects.all()

def index(request):
	urltxt = request.GET.get('id')
	data = summarizeArticle(urltxt)
	return HttpResponse(data, content_type="application/json")

def summarizeArticle(urltxt):
	with urllib.request.urlopen(urltxt) as url:
	    html = url.read()
	soup = BeautifulSoup(html)
	text = getPlainText(soup)
	sentences = extractSentences(text)
	read_time = getReadTime(sentences, text)
	summary = summarize(text, word_count=50)
	ret = json.dumps({"data": [read_time, summary]})
	return ret

def getPlainText(soup):
    # remove script and style elements
    for script in soup(["script", "style"]):
        script.extract()
    text = soup.body.get_text()

    # remove trailing white space and blank lines
    lines = (line.strip() for line in text.splitlines())
    text = '\n'.join(line for line in lines if line)
    return text

def isStringLong(s):
    if (len(s) > 50): return True
    else: return False

def noLongConsecutiveChars(s):
    init = s[0] if len(s) > 0 else '';
    consec_freq = []
    count = 0
    for c in s:
        if c == init: count += 1
        else:
            consec_freq.append(count)
            init = c
            count = 1
    consec_freq.append(count)
    return (max(consec_freq) / len(s) < 0.5)

def isSentence(s):
    return isStringLong(s) and noLongConsecutiveChars(s)

def extractSentences(text):
	sentences = ""
	for line in text.splitlines():
		if isSentence(line):
			sentences += line + "\n"
	return sentences

def getReadTime(sentences, text):
    num_words = len(sentences.split())
    read_time = num_words / 200

    num_other_words = len(text.split()) - num_words
    other_read_time = 0.1 * (num_other_words / 200)

    total_read_time = math.ceil(read_time + other_read_time)
    return total_read_time
