require('dotenv').config();
const strapiUrl = process.env.STRAPI_URL;
console.log("URL:", strapiUrl);
fetch(`${strapiUrl}/api/testimonials?populate=img`).then(r => r.json()).then(data => {
  const strapiTestimonials = data.data.map(item => ({
    text: item.text,
    by: item.by,
    role: item.role,
    img: item.img?.url ? `${strapiUrl}${item.img.url}` : '/images/img-66.jpg'
  }));
  console.log(strapiTestimonials);
}).catch(e => console.error(e));
