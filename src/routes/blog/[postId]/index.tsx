import { component$ } from "@builder.io/qwik";
import type { DocumentHead, StaticGenerateHandler } from '@builder.io/qwik-city';
import { routeLoader$ } from "@builder.io/qwik-city";
import { getDetail, getList } from "~/libs/microcms";
import { useServerTimeLoader } from "~/routes/layout";

// SSGのために動的パスを返す
export const onStaticGenerate: StaticGenerateHandler = async () => {
    const { contents } = await getList();
    const paths = contents.map((post) => {
        return post.id;
    });
    return {
        params: paths.map((postId) => {
            return { postId };
        }),
    };
};

// microCMSから記事詳細を取得する
export const usePostLoader = routeLoader$(async ({ params, status }) => {
    try {
        const post = await getDetail(params.postId);
        return post;
    } catch {
        // 記事がない場合はStatus Code 404を返す
        status(404);
    }
});

export default component$(() => {
    const serverTime = useServerTimeLoader();
    const post = usePostLoader();

    if (!post.value) {
        return <h1>Not Found.</h1>;
    }

    return (
        <div>
            <h1>Server time: {serverTime.value.date}</h1>
            <h2>{post.value.title}</h2>
            <div dangerouslySetInnerHTML={post.value.content}></div>
        </div>
    );
});

// 動的にheadを書き換える
export const head: DocumentHead = ({ resolveValue }) => {
    const post = resolveValue(usePostLoader);

    return {
        title: post?.title || "Welcome to Qwik",
        meta: [
            {
                name: "description",
                content: post?.title || "Qwik site description",
            },
        ],
    };
};