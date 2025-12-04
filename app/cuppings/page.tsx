'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Loader from '../components/Loader';

interface Sample {
  id: string;
  sampleId: string;
  origin: string;
  fragranceAroma?: number;
  flavor?: number;
  aftertaste?: number;
  acidity?: number;
  body?: number;
  balance?: number;
  overall?: number;
  finalScore?: number;
  primaryDefects?: number;
  secondaryDefects?: number;
  taint?: number;
  fault?: number;
  roastDefects?: string;
  notes?: string;
}

interface Cupping {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  samples: Sample[];
}

export default function CuppingsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const [cuppings, setCuppings] = useState<Cupping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) return;

    const fetchCuppings = async () => {
      try {
        const response = await fetch('/api/cuppings');
        if (!response.ok) {
          throw new Error('Failed to fetch cuppings');
        }
        const data = await response.json();
        setCuppings(data.cuppings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCuppings();
  }, [session, status]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  if (status === 'loading' || loading) {
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
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Cuppings</h1>
          </div>
          <Link
            href="/cuppings/new"
            className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            New Cupping
          </Link>
        </div>
        <div className="px-4 py-6 sm:px-0">
          {cuppings.length === 0 ? (
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cuppings yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first cupping session.
              </p>
              <Link
                href="/cuppings/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create New Cupping
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Samples
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cuppings.map((cupping) => {
                    return (
                      <tr key={cupping.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {cupping.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(cupping.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cupping.samples.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <Link
                            href={`/cuppings/${cupping.id}/results`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Results
                          </Link>
                          <Link
                            href={`/cuppings/${cupping.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Modify Cupping
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div >
  );
}
