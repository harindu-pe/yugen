import { request, gql } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

// Function to fetch posts
export const getPosts = async () => {
  // Graph CMS Query
  const query = gql`
    query MyQuery {
      postsConnection {
        edges {
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  // Requesting data from Graph CMS
  const result = await request(graphqlAPI, query);

  return result.postsConnection.edges;
};

// Function to fetch post
export const getPostDetails = async (slug) => {
  // Graph CMS Query
  const query = gql`
    query GetPostDetails($slug: String!) {
      post(where: { slug: $slug }) {
        author {
          bio
          name
          id
          photo {
            url
          }
        }
        createdAt
        slug
        title
        excerpt
        featuredImage {
          url
        }
        categories {
          name
          slug
        }
        content {
          raw
        }
      }
    }
  `;

  // Requesting data from Graph CMS
  const result = await request(graphqlAPI, query, { slug });

  return result.post;
};

// Function to fetch most recent posts
export const getRecentPosts = async () => {
  const query = gql`
    query GetPostDetails() {
      posts(
        orderBy: createdAt_ASC 
        last:3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  // Requesting data from Graph CMS
  const result = await request(graphqlAPI, query);

  return result.posts;
};

// Function to fetch similar posts
export const getSimilarPosts = async (categories, slug) => {
  const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {
      posts(
        where: {
          slug_not: $slug
          AND: { categories_some: { slug_in: $categories } }
        }
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  // Requesting data from Graph CMS
  const result = await request(graphqlAPI, query, { categories, slug });

  return result.posts;
};

// Function to fetch categories
export const getCategories = async () => {
  const query = gql`
    query GetCategories {
      categories {
        name
        slug
      }
    }
  `;
  // Requesting data from Graph CMS
  const result = await request(graphqlAPI, query);

  return result.categories;
};

// Function to submit comments to GraphCMS
export const submitComment = async (obj) => {
  const result = await fetch("/api/comments/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(obj),
  });

  return result.json();
};

// Function to fetch comments for each post
export const getComments = async (slug) => {
  const query = gql`
    query GetComments($slug: String!) {
      comments(where: { post: { slug: $slug } }) {
        name
        createdAt
        comment
      }
    }
  `;
  // Requesting data from Graph CMS
  const result = await request(graphqlAPI, query, { slug });

  return result.comments;
};

// Function to fetch posts for each category
export const getCategoryPost = async (slug) => {
  const query = gql`
    query GetCategoryPost($slug: String!) {
      postsConnection(where: { categories_some: { slug: $slug } }) {
        edges {
          cursor
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });

  return result.postsConnection.edges;
};
