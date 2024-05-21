import prismadb from "@/lib/db";

interface DashboardPageProps {
    params: {
        storeId: string;
    };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
        },
    });

    return <div>Active store name: {store?.name}</div>;
};

export default DashboardPage;
