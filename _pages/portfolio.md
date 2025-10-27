---
title: "Portfolio"
permalink: /portfolio/
layout: single
author_profile: true
toc: true
---

{% assign data = site.data.portfolio %}

## Client Projects

<div class="grid__wrapper">
{% for item in data.client_projects %}
  <div class="archive__item">
    <div class="archive__item-teaser">
      <img src="{{ item.img }}" alt="{{ item.name }}" />
    </div>
    <div class="archive__item-body">
      <h3 class="archive__item-title">{{ item.name }} <small>({{ item.year }})</small></h3>
      <p class="archive__item-excerpt">{{ item.description }} — {{ item.category }}</p>
      <p><strong>Involvement:</strong> {{ item.involvement }}</p>
      <p><strong>Tech:</strong> {{ item.tech | join: ', ' }}</p>
      {% if item.website %}
      <p><a href="{{ item.website }}" target="_blank" rel="noopener">Visit</a></p>
      {% endif %}
    </div>
  </div>
{% endfor %}
</div>

## Personal Projects

<ul>
{% for item in data.personal_projects %}
  <li>
    <strong>{{ item.name }}</strong> — {{ item.type }} ({{ item.year }})<br/>
    {{ item.description }}<br/>
    <em>{{ item.tech | join: ', ' }}</em>
    {% if item.link %}
      — <a href="{{ item.link }}" target="_blank" rel="noopener">Link</a>
    {% endif %}
  </li>
{% endfor %}
</ul>

## Open Source Contributions

{% for project in data.open_source_contributions %}
  <h3>{{ project.organization }} — {{ project.project }} ({{ project.year }})</h3>
  <p>{{ project.description }}</p>
  <ul>
  {% for pr in project.prs %}
    <li>
      <a href="{{ pr.url }}" target="_blank" rel="noopener">{{ pr.title }}</a>
      {% if pr.demo %} — <a href="{{ pr.demo }}" target="_blank" rel="noopener">demo</a>{% endif %}
    </li>
  {% endfor %}
  </ul>
{% endfor %}


