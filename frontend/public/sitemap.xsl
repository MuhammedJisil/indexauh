<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html>
<head>
  <title>XML Sitemap</title>
  <style>
    body { font-family: -apple-system, Arial, sans-serif; margin: 40px; color: #1A202C; }
    h1 { font-size: 1.4rem; margin-bottom: 4px; }
    p.count { color: #6B7280; margin-top: 0; margin-bottom: 24px; font-size: 0.9rem; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #2D3748; color: #fff; text-align: left; padding: 10px 14px; font-size: 0.85rem; }
    td { border-bottom: 1px solid #e5e7eb; padding: 10px 14px; font-size: 0.9rem; }
    tr:nth-child(even) td { background: #F8FAFF; }
    a { color: #38B2AC; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>XML Sitemap</h1>
  <xsl:choose>
    <xsl:when test="//sitemap:sitemapindex">
      <p class="count"><xsl:value-of select="count(//sitemap:sitemap)"/> sitemap(s)</p>
      <table>
        <tr><th>Sitemap URL</th></tr>
        <xsl:for-each select="//sitemap:sitemap">
          <tr>
            <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
          </tr>
        </xsl:for-each>
      </table>
    </xsl:when>
    <xsl:otherwise>
      <p class="count"><xsl:value-of select="count(//sitemap:url)"/> URL(s)</p>
      <table>
        <tr><th>URL</th><th>Last Modified</th></tr>
        <xsl:for-each select="//sitemap:url">
          <tr>
            <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
            <td><xsl:value-of select="sitemap:lastmod"/></td>
          </tr>
        </xsl:for-each>
      </table>
    </xsl:otherwise>
  </xsl:choose>
</body>
</html>
</xsl:template>
</xsl:stylesheet>