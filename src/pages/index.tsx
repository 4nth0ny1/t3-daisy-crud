import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import type { Post } from "../types";
import { type FC, useState } from "react";

type PostProps = {
  post: Post;
};

const Post = ({ post }: PostProps) => {
  const { id, content, title, likes } = post;
  console.log(post);

  const ctx = api.useContext();

  const { mutate: deleteMutation } = api.post.delete.useMutation({
    onSettled: async () => {
      await ctx.post.getAll.invalidate();
    },
  });

  return (
    <div className="p-4 text-center" key={id}>
      <div className="card w-96 bg-base-100 bg-slate-800 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{content}</p>

          <div className="card-actions justify-end">
            <p className="flex flex-row justify-start pt-6">
              Likes: {likes.length}
            </p>
            <button
              className="btn-primary btn"
              onClick={() => deleteMutation(id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Posts = () => {
  const { data: posts, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-row flex-wrap justify-center">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

const CreatePost: FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const ctx = api.useContext();

  const postEntry = api.post.create.useMutation({
    onMutate: async (newEntry) => {
      await ctx.post.getAll.cancel();
      ctx.post.getAll.setData((prevEntries) => {
        if (prevEntries) {
          return [newEntry, ...prevEntries];
        } else {
          return [newEntry];
        }
      });
    },
    onSettled: async () => {
      await ctx.post.getAll.invalidate();
      setTitle("");
      setContent("");
    },
  });

  return (
    <form
      className="flex flex-row gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        postEntry.mutate({
          title,
          content,
        });
      }}
    >
      <input
        type="text"
        placeholder="Add a title"
        className="input-bordered input w-full max-w-xs"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Create a post ..."
        className="input-bordered input w-full max-w-xs"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="btn-primary btn">post</button>
    </form>
  );
};

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn-ghost btn text-2xl normal-case">T3 Daisy Crud</a>
      </div>
      <div className="flex-none">
        <AuthShowcase />
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col items-center">
        <Navbar />
        <br></br>
        <CreatePost />
        <br></br>
        <Posts />
      </div>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-row items-center justify-center gap-4 p-4">
      <p className="text-center text-xl">
        {sessionData && <span>{sessionData.user?.name}</span>}
      </p>
      <button
        className="btn-accent btn rounded-full px-4 py-3 font-semibold no-underline transition"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
