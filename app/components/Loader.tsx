import Header from '@/app/components/Header';

export default function Loader() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    </div>
  );
}
