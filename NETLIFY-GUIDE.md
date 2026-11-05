# Publish the school website free with Netlify

This is a static website, so it can be published by dragging the `outputs` folder to Netlify Drop. Its `index.html` is already at the folder root, and `netlify.toml` sets the publish directory.

1. Open [Netlify Drop](https://app.netlify.com/drop).
2. Sign in or create a free Netlify account so you can keep and manage the site.
3. Drag the entire `outputs` folder from your computer onto the drop area.
4. Netlify will publish it and show you the live website address. You can rename the site in the Netlify dashboard.

To publish later changes, drag the updated `outputs` folder to the site's deploy area in Netlify. Photos listed in `gallery-data.js` and stored in `assets/gallery/` will be published with the website. The in-page upload button stores items only in the browser that uploaded them.

Netlify's [manual deploy guide](https://docs.netlify.com/deploy/create-deploys/) explains drag-and-drop publishing. Its current [Free plan](https://www.netlify.com/pricing/) is listed at $0; it has monthly usage limits, so the site can pause if it reaches those limits.
