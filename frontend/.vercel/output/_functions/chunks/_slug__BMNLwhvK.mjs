import { c as createComponent } from './astro-component_UFxQwNtE.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute, u as unescapeHTML } from './entrypoint_Dt0afzmA.mjs';
import { $ as $$BaseLayout, a as $$ContactForm, r as renderScript } from './BaseLayout_C_2JpKHS.mjs';

const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const strapiUrl = "https://api.indexedu.in";
  let post = null;
  let relatedPosts = [];
  let notFound = false;
  try {
    const res = await fetch(
      `${strapiUrl}/api/index-blogs?filters[Slug][$eq]=${slug}&populate[0]=featuredImage&populate[1]=categories&populate[2]=faq`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const raw = data.data[0];
        post = {
          id: raw.id,
          title: raw.title || "Untitled",
          slug: raw.Slug || raw.slug || slug,
          content: raw.content || "",
          excerpt: raw.excerpt || "",
          authorName: raw.authorName || "Index Office Services",
          publishedDate: raw.publishedDate || raw.publishedAt || null,
          metaTitle: raw.metaTitle || raw.title || "Blog",
          metaDescription: raw.metaDescription || raw.excerpt || "",
          featuredImage: raw.featuredImage?.url ? `${strapiUrl}${raw.featuredImage.url}` : null,
          categories: (raw.categories || []).map((c) => c.name || c),
          faq: raw.faq || []
        };
        if (post.categories.length > 0) {
          const relRes = await fetch(
            `${strapiUrl}/api/index-blogs?filters[categories][name][$eq]=${encodeURIComponent(post.categories[0])}&filters[Slug][$ne]=${slug}&populate[0]=featuredImage&pagination[pageSize]=3`
          );
          if (relRes.ok) {
            const relData = await relRes.json();
            relatedPosts = (relData.data || []).map((item) => ({
              title: item.title,
              slug: item.Slug || item.slug,
              excerpt: item.excerpt || "",
              featuredImage: item.featuredImage?.url ? `${strapiUrl}${item.featuredImage.url}` : null,
              categories: (item.categories || []).map((c) => c.name || c)
            }));
          }
        }
      } else {
        notFound = true;
      }
    } else {
      notFound = true;
    }
  } catch (e) {
    console.warn("Failed to fetch post:", e);
    notFound = true;
  }
  if (notFound || !post) {
    return Astro2.redirect("/blogs/", 302);
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
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${post.metaTitle} — Index Office Services`, "description": post.metaDescription || post.excerpt, "data-astro-cid-4sn4zg3r": true }, { "default": async ($$result2) => renderTemplate`   ${maybeRenderHead()}<section style="background:#2D3748;padding:52px 24px 76px;position:relative;overflow:hidden;" data-astro-cid-4sn4zg3r> <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(56,178,172,0.16) 1px,transparent 1px);background-size:28px 28px;pointer-events:none;" data-astro-cid-4sn4zg3r></div> <div style="position:absolute;bottom:-60px;left:50%;transform:translateX(-50%);width:700px;height:300px;background:radial-gradient(ellipse,rgba(56,178,172,0.1) 0%,transparent 70%);pointer-events:none;" data-astro-cid-4sn4zg3r></div> <div style="max-width:860px;margin:0 auto;position:relative;z-index:1;text-align:center;" data-astro-cid-4sn4zg3r> <!-- Categories --> ${post.categories.map((cat) => renderTemplate`<a href="/blogs/" style="display:inline-block;background:#38B2AC;color:#fff;border-radius:9999px;font-size:0.72rem;font-weight:700;padding:4px 14px;text-transform:uppercase;letter-spacing:0.07em;margin:0 4px 14px;text-decoration:none;" data-astro-cid-4sn4zg3r>${cat}</a>`)} <h1 style="font-size:clamp(1.6rem,4vw,2.8rem);font-weight:900;color:#fff;line-height:1.2;margin:0;" data-astro-cid-4sn4zg3r>${post.title}</h1> </div> </section>  ${post.featuredImage && renderTemplate`<div style="background:#F8FAFF;padding:0 24px;" data-astro-cid-4sn4zg3r> <div style="max-width:900px;margin:0 auto;transform:translateY(-40px);" data-astro-cid-4sn4zg3r> <div class="featured-img-frame" data-astro-cid-4sn4zg3r> <img${addAttribute(post.featuredImage, "src")}${addAttribute(post.title, "alt")} loading="eager" data-astro-cid-4sn4zg3r> </div> </div> </div>`} <div style="background:#F8FAFF;padding:0 24px;" data-astro-cid-4sn4zg3r> <div style="max-width:860px;margin:0 auto;text-align:center;padding-top:20px;" data-astro-cid-4sn4zg3r> <div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;font-size:0.85rem;color:#6B7280;" data-astro-cid-4sn4zg3r> <span style="display:flex;align-items:center;gap:6px;" data-astro-cid-4sn4zg3r> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-4sn4zg3r><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" data-astro-cid-4sn4zg3r></path><circle cx="12" cy="7" r="4" data-astro-cid-4sn4zg3r></circle></svg> ${post.authorName} </span> ${post.publishedDate && renderTemplate`<span style="display:flex;align-items:center;gap:6px;" data-astro-cid-4sn4zg3r> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-4sn4zg3r><rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-astro-cid-4sn4zg3r></rect><line x1="16" y1="2" x2="16" y2="6" data-astro-cid-4sn4zg3r></line><line x1="8" y1="2" x2="8" y2="6" data-astro-cid-4sn4zg3r></line><line x1="3" y1="10" x2="21" y2="10" data-astro-cid-4sn4zg3r></line></svg> ${formatDate(post.publishedDate)} </span>`} </div> </div> </div>  <section style="background:#F8FAFF;position:relative;" data-astro-cid-4sn4zg3r> <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(45,55,72,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(45,55,72,0.02) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;" data-astro-cid-4sn4zg3r></div> <div class="post-layout" data-astro-cid-4sn4zg3r> <!-- LEFT: Article --> <article data-astro-cid-4sn4zg3r> <!-- Breadcrumb --> <nav class="breadcrumb" aria-label="Breadcrumb" data-astro-cid-4sn4zg3r> <a href="/" data-astro-cid-4sn4zg3r>Home</a> <span class="breadcrumb-sep" data-astro-cid-4sn4zg3r>›</span> <a href="/blogs/" data-astro-cid-4sn4zg3r>Blog</a> <span class="breadcrumb-sep" data-astro-cid-4sn4zg3r>›</span> <span style="color:#1A202C;font-weight:600;" data-astro-cid-4sn4zg3r>${post.title}</span> </nav> <!-- Rich text content from Strapi --> <div class="post-content" data-astro-cid-4sn4zg3r>${unescapeHTML(post.content)}</div> <!-- FAQ section (if any) --> ${post.faq && post.faq.length > 0 && renderTemplate`<div style="margin-top:48px;" data-astro-cid-4sn4zg3r> <h2 style="font-size:1.6rem;font-weight:900;color:#1A202C;margin-bottom:20px;" data-astro-cid-4sn4zg3r>Frequently Asked Questions</h2> <div id="postFaqList" data-astro-cid-4sn4zg3r> ${post.faq.map((f, i) => renderTemplate`<div class="faq-item"${addAttribute(`pfaq-${i}`, "id")} data-astro-cid-4sn4zg3r> <button class="faq-q"${addAttribute(`toggleFaq('pfaq-${i}')`, "onclick")} aria-expanded="false" data-astro-cid-4sn4zg3r> <span data-astro-cid-4sn4zg3r>${f.question || f.q}</span> <span class="faq-icon" data-astro-cid-4sn4zg3r>+</span> </button> <div class="faq-a" data-astro-cid-4sn4zg3r> <p data-astro-cid-4sn4zg3r>${f.answer || f.a}</p> </div> </div>`)} </div> </div>`} <!-- CTA strip --> <div style="margin-top:48px;background:#2D3748;border-radius:20px;padding:32px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;" data-astro-cid-4sn4zg3r> <div data-astro-cid-4sn4zg3r> <p style="color:#38B2AC;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px;" data-astro-cid-4sn4zg3r>Need Expert Help?</p> <p style="color:#fff;font-size:1.15rem;font-weight:800;margin:0;" data-astro-cid-4sn4zg3r>Talk to our attestation experts today</p> <p style="color:#B2F5EA;font-size:0.9rem;margin:6px 0 0;" data-astro-cid-4sn4zg3r>Free consultation — no obligation</p> </div> <a href="/contact" style="display:inline-flex;align-items:center;gap:8px;background:#38B2AC;color:#fff;padding:13px 26px;border-radius:9999px;font-weight:700;text-decoration:none;white-space:nowrap;flex-shrink:0;" data-astro-cid-4sn4zg3r>
Contact Us &rarr;
</a> </div> <!-- Back to blogs --> <div style="margin-top:28px;" data-astro-cid-4sn4zg3r> <a href="/blogs/" style="display:inline-flex;align-items:center;gap:8px;color:#6B7280;font-size:0.9rem;font-weight:600;text-decoration:none;" data-astro-cid-4sn4zg3r> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-4sn4zg3r><path d="M19 12H5M12 19l-7-7 7-7" data-astro-cid-4sn4zg3r></path></svg>
Back to all articles
</a> </div> </article> <!-- RIGHT: Sidebar --> <aside class="post-sidebar" data-astro-cid-4sn4zg3r> <!-- Quick enquiry form --> <div class="sidebar-card" style="background:#2D3748;border-color:#2D3748;" data-astro-cid-4sn4zg3r> <h3 style="color:#38B2AC;" data-astro-cid-4sn4zg3r>Free Consultation</h3> <p style="color:#B2F5EA;font-size:0.88rem;line-height:1.6;margin-bottom:16px;" data-astro-cid-4sn4zg3r>Get expert guidance on attestation, PCC or business setup — no cost, no obligation.</p> ${renderComponent($$result2, "ContactForm", $$ContactForm, { "data-astro-cid-4sn4zg3r": true })} </div> <!-- Related posts --> ${relatedPosts.length > 0 && renderTemplate`<div class="sidebar-card" data-astro-cid-4sn4zg3r> <h3 data-astro-cid-4sn4zg3r>Related Articles</h3> ${relatedPosts.map((p) => renderTemplate`<a${addAttribute(`/blog/${p.slug}/`, "href")} class="related-item" data-astro-cid-4sn4zg3r> ${p.featuredImage ? renderTemplate`<img${addAttribute(p.featuredImage, "src")}${addAttribute(p.title, "alt")} class="related-img" loading="lazy" data-astro-cid-4sn4zg3r>` : renderTemplate`<div style="width:56px;height:56px;border-radius:10px;background:linear-gradient(135deg,#2D3748,#38B2AC);flex-shrink:0;" data-astro-cid-4sn4zg3r></div>`} <div data-astro-cid-4sn4zg3r> <p style="font-size:0.85rem;font-weight:600;color:#1A202C;line-height:1.4;margin:0 0 4px;" data-astro-cid-4sn4zg3r>${p.title}</p> ${p.categories[0] && renderTemplate`<span style="font-size:0.72rem;color:#38B2AC;font-weight:700;" data-astro-cid-4sn4zg3r>${p.categories[0]}</span>`} </div> </a>`)} </div>`} <!-- Share --> <div class="sidebar-card" data-astro-cid-4sn4zg3r> <h3 data-astro-cid-4sn4zg3r>Share This Article</h3> <div style="display:flex;gap:10px;flex-wrap:wrap;" data-astro-cid-4sn4zg3r> <a id="shareWhatsApp" href="#" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;background:#25D366;color:#fff;border-radius:9999px;padding:8px 16px;font-size:0.82rem;font-weight:700;text-decoration:none;" data-astro-cid-4sn4zg3r> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-4sn4zg3r><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" data-astro-cid-4sn4zg3r></path></svg>
WhatsApp
</a> <a id="shareFacebook" href="#" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;background:#1877F2;color:#fff;border-radius:9999px;padding:8px 16px;font-size:0.82rem;font-weight:700;text-decoration:none;" data-astro-cid-4sn4zg3r> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-4sn4zg3r><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-astro-cid-4sn4zg3r></path></svg>
Facebook
</a> <a id="shareLinkedIn" href="#" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;background:#0A66C2;color:#fff;border-radius:9999px;padding:8px 16px;font-size:0.82rem;font-weight:700;text-decoration:none;" data-astro-cid-4sn4zg3r> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-4sn4zg3r><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" data-astro-cid-4sn4zg3r></path></svg>
LinkedIn
</a> </div> </div> </aside> </div> </section> ${renderScript($$result2, "/Users/jisil444/Desktop/Projects/Convex/indexauh/frontend/src/pages/blog/[slug].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/jisil444/Desktop/Projects/Convex/indexauh/frontend/src/pages/blog/[slug].astro", void 0);
const $$file = "/Users/jisil444/Desktop/Projects/Convex/indexauh/frontend/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
