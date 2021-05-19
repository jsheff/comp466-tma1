<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/resume">
<html>
  <head>
    <title>Part 1 | Resume</title>
    <link rel="stylesheet" href="/shared/css/style.css"/>
  </head>
  <body>
    <main>
      <header>
        <div class="content">
          <div class="logo">
            <img src="/shared/img/programming-3173456_small.png" alt=""></img>
          </div>
          <div class="heading">
            <h1>TMA 1</h1>
          </div>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li class="active"><a href="/part1/resume.xml">Part 1</a></li>
              <li><a href="/part2/part2.html">Part 2</a></li>
              <li><a href="/part3/part3.html">Part 3</a></li>
              <li><a href="/part4/part4.html">Part 4</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section>
        <div class="content">
          <div class="title">
            <h1>Part 1: Personal Resume</h1>
          </div>
          <div class="grid2">
            <div class="personal">
              <xsl:for-each select="personal">
                <h1><xsl:value-of select="name"/></h1>
                <button><a href="mailto:joyce@mail.com">Email me</a></button>          
              </xsl:for-each>
            </div>
            <div class="summary-heading">
              <p class="section-title">Summary</p>
            </div>
            <div class="summary">
              <xsl:for-each select="personal">
                <p><xsl:value-of select="summary"/></p>
              </xsl:for-each>
            </div>
            <div class="experience-heading">
              <p class="section-title">Experience</p>
            </div>
            <div class="experience">
              <xsl:for-each select="experience">
                <xsl:for-each select="work">
                  <div class="job">
                    <h3><xsl:value-of select="job_title"/></h3>
                    <p><xsl:value-of select="company"/>, <xsl:value-of select="start_date"/> - <xsl:value-of select="end_date"/></p>
                    <p><xsl:value-of select="description"/></p>
                  </div>
                </xsl:for-each>
              </xsl:for-each>
            </div>
            <div class="education-heading">
              <p class="section-title">Education</p>
            </div>
            <div class="education">
              <xsl:for-each select="education">
                <xsl:for-each select="school">
                  <div class="school">
                    <h3><xsl:value-of select="degree"/></h3>
                    <p><xsl:value-of select="school_name"/>, <xsl:value-of select="city"/>, <xsl:value-of select="province"/>, <xsl:value-of select="grad_date"/></p>
                    <p><xsl:value-of select="honors"/></p>
                  </div>
                </xsl:for-each>
              </xsl:for-each>
            </div>
          </div>
        </div>
      </section>

      
  
      <footer>
        <p>Joyce Sheffield, Copyright 2021</p>
      </footer>
    </main>
  </body>
</html>
</xsl:template>
</xsl:stylesheet>