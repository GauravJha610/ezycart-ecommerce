import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

const Home = () => {
    const {data : session} = useSession();
    // console.log(session?.user)
    return(
        <Layout>
            <div className="text-blue-900 flex justify-between">
                <h2>Hello, <b>{session?.user?.name}</b></h2>
                <div className="flex bg-gray-300 gap-1 text-black rounded-full p-1">
                    <img src={session?.user?.image} className=" rounded-full w-8 h-8"/>
                    <span className="px-2">{session?.user?.name}</span>
                </div>
            </div>
        </Layout>
    )
}
  

export default Home;