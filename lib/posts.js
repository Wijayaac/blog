import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const postDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // Get filenames under /posts
  const fileNames = fs.readdirSync(postDirectory);
  const allPostData = fileNames.map((fileName) => {
    // Remo ".md" form file name to get the id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    // Use gray matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });

  //   Sorts posts by data
  return allPostData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostsIds() {
  const fileNames = fs.readdirSync(postDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHTML = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    contentHTML,
    ...matterResult.data,
  };
}
