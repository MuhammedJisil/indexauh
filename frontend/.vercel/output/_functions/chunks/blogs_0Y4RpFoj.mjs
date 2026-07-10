import { c as createComponent } from './astro-component_UFxQwNtE.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_Dt0afzmA.mjs';
import { $ as $$BaseLayout, a as $$ContactForm, r as renderScript } from './BaseLayout_C_2JpKHS.mjs';

const prerender = false;
const $$Blogs = createComponent(async ($$result, $$props, $$slots) => {
  const strapiUrl = "https://api.indexedu.in";
  let posts = [];
  let categories = [];
  let fetchError = false;
  try {
    const res = await fetch(
      `${strapiUrl}/api/index-blogs?populate[0]=featuredImage&populate[1]=categories&sort=publishedDate:desc&pagination[pageSize]=100`
    );
    if (res.ok) {
      const data = await res.json();
      posts = (data.data || []).map((item) => ({
        id: item.id,
        title: item.title || "Untitled",
        slug: item.Slug || item.slug || "",
        excerpt: item.excerpt || "",
        authorName: item.authorName || "Index Office Services",
        publishedDate: item.publishedDate || item.publishedAt || null,
        featuredImage: item.featuredImage?.url ? `${strapiUrl}${item.featuredImage.url}` : item.featuredImage?.formats?.medium?.url ? `${strapiUrl}${item.featuredImage.formats.medium.url}` : item.featuredImage?.formats?.thumbnail?.url ? `${strapiUrl}${item.featuredImage.formats.thumbnail.url}` : null,
        categories: (item.categories || []).map((c) => c.name || c.displayName || c)
      }));
      const catSet = /* @__PURE__ */ new Set();
      posts.forEach((p) => p.categories.forEach((c) => catSet.add(c)));
      categories = Array.from(catSet);
    } else {
      fetchError = true;
    }
  } catch (e) {
    fetchError = true;
    console.warn("Could not fetch blog posts from Strapi:", e);
  }
  function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-AE", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return "";
    }
  }
  const fallbackPosts = [
    {
      id: 1,
      title: "Complete Guide to Certificate Attestation in UAE",
      slug: "certificate-attestation-uae-guide",
      excerpt: "Everything you need to know about getting your documents attested for use in the UAE — from apostille to MOFA.",
      authorName: "Index Office Services",
      publishedDate: "2024-03-15",
      featuredImage: "/images/img-1.webp",
      categories: ["Attestation"]
    },
    {
      id: 2,
      title: "How to Set Up a Business in Dubai: Step-by-Step",
      slug: "business-setup-dubai-guide",
      excerpt: "A practical guide to mainland, free zone and offshore company formation in Dubai for investors and entrepreneurs.",
      authorName: "Index Office Services",
      publishedDate: "2024-02-28",
      featuredImage: "/images/img-2.webp",
      categories: ["Business Setup"]
    },
    {
      id: 3,
      title: "Police Clearance Certificate: What You Need to Know",
      slug: "police-clearance-certificate-guide",
      excerpt: "Requirements, process and timelines for obtaining a PCC from UAE, India, Saudi Arabia and other countries.",
      authorName: "Index Office Services",
      publishedDate: "2024-02-10",
      featuredImage: "/images/img-57.webp",
      categories: ["PCC"]
    },
    {
      id: 4,
      title: "MOFA Attestation vs Apostille — What's the Difference?",
      slug: "mofa-vs-apostille-difference",
      excerpt: "Understanding which process applies to your documents and country is crucial. This guide explains both clearly.",
      authorName: "Index Office Services",
      publishedDate: "2024-01-22",
      featuredImage: "/images/img-36.webp",
      categories: ["Attestation"]
    },
    {
      id: 5,
      title: "Embassy Attestation in UAE: A Country-by-Country Overview",
      slug: "embassy-attestation-uae-overview",
      excerpt: "Different embassies have different requirements. Learn what each one needs so your documents go through first time.",
      authorName: "Index Office Services",
      publishedDate: "2024-01-08",
      featuredImage: "/images/img-57.webp",
      categories: ["Attestation"]
    },
    {
      id: 6,
      title: "Free Zone vs Mainland Company in UAE: Which Is Right for You?",
      slug: "free-zone-vs-mainland-uae",
      excerpt: "Comparing the pros and cons of both UAE business structures to help you decide which setup suits your goals.",
      authorName: "Index Office Services",
      publishedDate: "2023-12-18",
      featuredImage: "/images/img-16.webp",
      categories: ["Business Setup"]
    }
  ];
  const displayPosts = posts.length > 0 ? posts : fallbackPosts;
  const displayCategories = categories.length > 0 ? categories : ["Attestation", "Business Setup", "PCC"];
  const FALLBACK_IMG = "/fallback.webp";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Blogs - Index Attestation and Business Setup", "description": "Read expert guides and articles on certificate attestation, MOFA, apostille, company formation, police clearance certificates and business setup in the UAE.", "data-astro-cid-zb2vaeus": true }, { "default": async ($$result2) => renderTemplate`   ${maybeRenderHead()}<section class="blog-intro" data-astro-cid-zb2vaeus> <div class="blog-intro-inner" data-astro-cid-zb2vaeus> <p class="blog-intro-eyebrow" data-astro-cid-zb2vaeus>Insights & Guides</p> <h1 class="blog-intro-title" data-astro-cid-zb2vaeus>Our Blogs &amp; Articles</h1> </div> </section>  <section style="background:#F8FAFF;padding:8px 24px 80px;position:relative;" data-astro-cid-zb2vaeus> <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(45,55,72,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(45,55,72,0.02) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0;" data-astro-cid-zb2vaeus></div> <div style="max-width:1280px;margin:0 auto;position:relative;z-index:1;" data-astro-cid-zb2vaeus> <!-- Category filter --> <div class="filter-bar" id="filterBar" data-astro-cid-zb2vaeus> <button class="filter-pill active" data-cat="all" data-astro-cid-zb2vaeus>All Posts</button> ${displayCategories.map((cat) => renderTemplate`<button class="filter-pill"${addAttribute(cat, "data-cat")} data-astro-cid-zb2vaeus>${cat}</button>`)} </div> <!-- Two-column layout: grid + sidebar --> <div class="blog-layout" data-astro-cid-zb2vaeus> <!-- LEFT: Blog grid --> <div data-astro-cid-zb2vaeus> ${fetchError && posts.length === 0 && renderTemplate`<div style="background:#FFF3CD;border:1px solid #FBBF24;border-radius:12px;padding:14px 20px;margin-bottom:28px;font-size:0.9rem;color:#92400E;" data-astro-cid-zb2vaeus>
⚠️ Could not connect to Strapi. Showing placeholder content. Make sure Strapi is running and the <code data-astro-cid-zb2vaeus>STRAPI_URL</code> env variable is set.
</div>`} <div class="blog-grid" id="blogGrid" data-astro-cid-zb2vaeus> ${displayPosts.map((post, i) => renderTemplate`<a${addAttribute(`/blog/${post.slug}/`, "href")} class="blog-card"${addAttribute(JSON.stringify(post.categories), "data-cats")} data-astro-cid-zb2vaeus> <div class="blog-card-img-wrap" data-astro-cid-zb2vaeus> <img${addAttribute(post.featuredImage || FALLBACK_IMG, "src")}${addAttribute(post.title, "alt")} class="blog-card-img"${addAttribute(i < 3 ? "eager" : "lazy", "loading")} data-astro-cid-zb2vaeus> </div> <div class="blog-card-body" data-astro-cid-zb2vaeus> ${post.categories[0] && renderTemplate`<span class="blog-card-cat" data-astro-cid-zb2vaeus>${post.categories[0]}</span>`} <h2 class="blog-card-title" data-astro-cid-zb2vaeus>${post.title}</h2> <span class="blog-card-read" data-astro-cid-zb2vaeus>
Read Article
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-zb2vaeus><path d="M5 12h14M12 5l7 7-7 7" data-astro-cid-zb2vaeus></path></svg> </span> </div> </a>`)} </div> <!-- Empty state after filter --> <div id="noResults" style="display:none;" class="no-posts" data-astro-cid-zb2vaeus> <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px;" data-astro-cid-zb2vaeus><circle cx="11" cy="11" r="8" data-astro-cid-zb2vaeus></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-zb2vaeus></line></svg> <p style="font-size:1.1rem;font-weight:600;color:#374151;margin:0 0 6px;" data-astro-cid-zb2vaeus>No posts in this category</p> <p style="font-size:0.95rem;margin:0;" data-astro-cid-zb2vaeus>Try selecting a different filter above.</p> </div> </div> <!-- RIGHT: Sidebar --> <aside class="blog-sidebar" data-astro-cid-zb2vaeus> <!-- Quick enquiry --> <div class="sidebar-card" style="background:#2D3748;border-color:#2D3748;" data-astro-cid-zb2vaeus> <h3 style="color:#38B2AC;" data-astro-cid-zb2vaeus>Free Consultation</h3> <p style="color:#B2F5EA;font-size:0.88rem;line-height:1.6;margin-bottom:16px;" data-astro-cid-zb2vaeus>Need help with attestation, PCC or business setup? Ask our experts — no cost, no obligation.</p> ${renderComponent($$result2, "ContactForm", $$ContactForm, { "data-astro-cid-zb2vaeus": true })} </div> <!-- Recent posts --> ${displayPosts.length > 1 && renderTemplate`<div class="sidebar-card" data-astro-cid-zb2vaeus> <h3 data-astro-cid-zb2vaeus>Recent Articles</h3> ${displayPosts.slice(0, 5).map((post) => renderTemplate`<a${addAttribute(`/blog/${post.slug}/`, "href")} class="sidebar-recent-item" data-astro-cid-zb2vaeus> <img${addAttribute(post.featuredImage || FALLBACK_IMG, "src")}${addAttribute(post.title, "alt")} class="sidebar-recent-img" loading="lazy" data-astro-cid-zb2vaeus> <div data-astro-cid-zb2vaeus> <p class="sidebar-recent-title" data-astro-cid-zb2vaeus>${post.title}</p> ${post.publishedDate && renderTemplate`<p class="sidebar-recent-date" data-astro-cid-zb2vaeus>${formatDate(post.publishedDate)}</p>`} </div> </a>`)} </div>`} </aside> </div> </div> </section> ${renderScript($$result2, "/Users/jisil444/Desktop/Projects/Convex/indexauh/frontend/src/pages/blogs.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/jisil444/Desktop/Projects/Convex/indexauh/frontend/src/pages/blogs.astro", void 0);
const $$file = "/Users/jisil444/Desktop/Projects/Convex/indexauh/frontend/src/pages/blogs.astro";
const $$url = "/blogs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blogs,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
