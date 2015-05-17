link-crawler
================

This is a code snippet for crawling links from web URL written in Node.js. This snippet starts with a url on the web (ex: http://python.org) for now its hard coded in "server.js", fetches the web-page corresponding to that url, and parses all the links on that page into a repository of links "ouput.js". Next, it start fetching the contents of the URL from the repository just created, parses the links from this new content into the repository and continues this process for all links in the repository until stopped with **Clt + c**.

Description
================

To start execution, just run command

    node server.js

This complete repository contains couple of files.

1. server.js

2. package.json

3. output.json

**server.js**

This file contains main code which fetches all links and store in *ouput.json*. Code is handled by multiple callbacks which runs it continously.

**package.json**

This file holds various metadata relevant to the project

**output.json**

A new `output.json` file is created automatically every time when program starts execution. It contains all links and and its attribute. 
**link** attribute contains actual link value.
**base_url** attribute contains Host url of link.
**parsed** is boolean attribute having *true* value if link is parsed and contains *false* if not parsed.
