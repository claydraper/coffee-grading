'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CuppingWithSamples } from '@/app/lib/definitions';
import SampleForm from '@/app/components/SampleForm';

export default function CuppingPage() {
  const params = useParams();
  const id = params?.id as string;
  const [cupping, setCupping] = useState<CuppingWithSamples | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      setError('No cupping ID provided');
      setLoading(false);
      return;
    }

    const fetchCupping = async () => {
      try {
        const response = await fetch(`/api/cuppings/${id}?includeSamples=true`, {
          credentials: 'include', // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch cupping');
        }

        const data = await response.json();
        setCupping(data);
      } catch (err) {
        console.error('Error fetching cupping:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the cupping');
        // Optionally redirect back to cuppings list on error
        // router.push('/cuppings');
      } finally {
        setLoading(false);
      }
    };

    fetchCupping();
  }, [id]);

  const handleSampleUpdate = (updatedSample: any) => {
    if (!cupping) return;

    setCupping({
      ...cupping,
      samples: cupping.samples.map(sample =>
        sample.id === updatedSample.id ? updatedSample : sample
      )
    });
  };

  const handleCompleteCupping = async () => {
    // Add any final validation or submission logic here
    alert('Cupping completed successfully!');
    router.push('/dashboard');
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!cupping) return <div className="p-4">Cupping not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Cupping: {cupping.name}</h1>
      {cupping.description && <p className="mb-6">{cupping.description}</p>}

      <div className="space-y-8">
        {cupping.samples.map((sample, index) => (
          <div key={sample.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl text-gray-900 font-semibold mb-4">Sample {index + 1}</h2>
            <SampleForm
              sample={sample}
              onUpdate={handleSampleUpdate}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleCompleteCupping}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Complete Cupping
        </button>
      </div>
    </div>
  );
}
