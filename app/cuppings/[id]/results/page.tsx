'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '@/app/components/Header';
import Loader from '@/app/components/Loader';

interface SampleData {
  id: string;
  sampleId: string;
  fragranceAroma?: number;
  flavor?: number;
  aftertaste?: number;
  acidity?: number;
  body?: number;
  uniformity?: number;
  balance?: number;
  cleanCup?: number;
  sweetness?: number;
  overall?: number;
  finalScore?: number;
}

interface CuppingData {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  samples: SampleData[];
}

export default function CuppingResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cupping, setCupping] = useState<CuppingData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/cuppings/${id}/results`);
        if (!response.ok) {
          throw new Error('Failed to fetch cupping results');
        }
        const data = await response.json();
        setCupping(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const prepareChartData = (sample: SampleData) => {
    return [
      { attribute: 'Fragrance/Aroma', value: sample.fragranceAroma ?? 0 },
      { attribute: 'Flavor', value: sample.flavor ?? 0 },
      { attribute: 'Aftertaste', value: sample.aftertaste ?? 0 },
      { attribute: 'Acidity', value: sample.acidity ?? 0 },
      { attribute: 'Body', value: sample.body ?? 0 },
      { attribute: 'Uniformity', value: sample.uniformity ?? 10 },
      { attribute: 'Balance', value: sample.balance ?? 0 },
      { attribute: 'Clean Cup', value: sample.cleanCup ?? 10 },
      { attribute: 'Sweetness', value: sample.sweetness ?? 10 },
      { attribute: 'Overall', value: sample.overall ?? 0 },
    ].filter(item => item.value > 0);
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cupping) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">No cupping data found</h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {cupping.name} - Results
              </h1>
              {cupping.description && (
                <p className="text-gray-600 mt-1">{cupping.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {new Date(cupping.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Back to List
            </button>
          </div>

          <div className="space-y-8">
            {cupping.samples.map((sample) => (
              <div key={sample.id} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Sample: {sample.sampleId}
                  {sample.finalScore !== null && sample.finalScore !== undefined && (
                    <span className="ml-4 px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                      Final Score: {(
                        Number(sample.fragranceAroma ?? 0) +
                        Number(sample.flavor ?? 0) +
                        Number(sample.aftertaste ?? 0) +
                        Number(sample.acidity ?? 0) +
                        Number(sample.body ?? 0) +
                        Number(sample.uniformity ?? 10) +
                        Number(sample.balance ?? 0) +
                        Number(sample.cleanCup ?? 10) +
                        Number(sample.sweetness ?? 10) +
                        Number(sample.overall ?? 0)
                      ).toFixed(2)}
                    </span>
                  )}
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareChartData(sample)}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <XAxis
                        dataKey="attribute"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, 10]}
                        label={{
                          value: 'Score (1-10)',
                          angle: -90,
                          position: 'insideLeft',
                        }}
                      />
                      <Tooltip
                        labelClassName='text-black'
                        formatter={(value) => [
                          `${value}`,
                          'Score',
                        ]}
                      />
                      <Bar
                        dataKey="value"
                        name="Score"
                        fill="#1243C9"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
