// Absolute import, defined in tsconfig.json
import { Article, BlogpostImage } from '@components/Article';
import type { Post } from './../index';
import {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  GetStaticPaths
} from 'next';

// Dynamic component
export default function BlogPost({
  post
}: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    <Article>
      <h1>{post.title}</h1>
      <BlogpostImage src="/image.jpeg" alt="image" />
      <p>{post.body}</p>
    </Article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('http://jsonplaceholder.typicode.com/posts');
  const posts: Post[] = await res.json();

  const paths = posts.map(post => ({
    params: {
      id: post.id.toString()
    }
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;

  const emptyPost: Post = {
    title: 'Post not found',
    body: '',
    id: 0,
    userId: 0
  }

  if (!params?.id) {
    return {
      props: {
        post: emptyPost
      }
    }
  }

  const res = await fetch(`http://jsonplaceholder.typicode.com/posts/${params.id}`);

  const post: Post = await res.json();

  return {
    props: {
      post,
    },
  }
}
