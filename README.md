# blog.jeevanmr.com

This is the source for my blog, built with Jekyll and the Minimal Mistakes theme, deployed via GitHub Pages.

## Local development

1. Install Ruby (3.x recommended) and Bundler.
2. Install gems:
   ```bash
   bundle install
   ```
3. Serve locally:
   ```bash
   bundle exec jekyll serve --livereload
   ```
4. Open `http://localhost:4000`.

## Structure

- `_posts/` — blog posts
- `_pages/` — static pages like About and Posts
- `_data/navigation.yml` — site navigation
- `assets/` — images and other assets
- `_config.yml` — site configuration

## Custom domain

Configured via `CNAME` for `blog.jeevanmr.com`. Update DNS to point the `CNAME` record to `jee1mr.github.io`.

