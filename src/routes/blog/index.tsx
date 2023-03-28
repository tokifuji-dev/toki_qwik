import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getList } from "~/libs/microcms";
import { useServerTimeLoader } from "~/routes/layout";

export const useListLoader = routeLoader$(async () => {
 const { contents } = await getList();
 return contents;
});

export default component$(() => {

 const serverTime = useServerTimeLoader();
 const list = useListLoader();

 return (
  <div>
   <h1>Server time: {serverTime.value.date}</h1>

   <ul>
    {list.value.map((item) => (
     <li>
      <a href={`/blog/${item.id}`}>{item.title}</a>
     </li>
    ))}
   </ul>
  </div>
 );
});