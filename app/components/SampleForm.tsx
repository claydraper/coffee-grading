'use client';

import { useState, useEffect } from 'react';
import { Sample } from '@/app/lib/definitions';

interface SampleFormProps {
  sample: Sample;
  onUpdate: (updatedSample: Sample) => void;
}

export default function SampleForm({ sample, onUpdate }: SampleFormProps) {
  const [formData, setFormData] = useState<Partial<Sample>>(sample);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(sample);
  }, [sample]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const numericValue = ['fragranceAroma', 'dry', 'breakScore', 'flavor', 'aftertaste',
      'acidity', 'body', 'uniformity', 'balance', 'cleanCup', 'sweetness', 'overall',
      'primaryDefects', 'secondaryDefects', 'moisture', 'taint', 'fault'].includes(name)
      ? parseFloat(value) || 0
      : value;

    const updatedData = { ...formData, [name]: numericValue };

    const scoreFields = [
      'fragranceAroma', 'flavor', 'aftertaste', 'acidity', 'body',
      'uniformity', 'balance', 'cleanCup', 'sweetness', 'overall',
      'taint', 'fault'
    ];

    if (scoreFields.includes(name)) {
      updatedData.finalScore = calculateFinalScore(updatedData);
    }

    setFormData(updatedData);
    onUpdate(updatedData as Sample);
  };

  const calculateFinalScore = (data: Partial<Sample>) => {
    const qualitySum = (
      (data.fragranceAroma ?? 0) +
      (data.flavor ?? 0) +
      (data.aftertaste ?? 0) +
      (data.acidity ?? 0) +
      (data.body ?? 0) +
      (data.uniformity ?? 0) +
      (data.balance ?? 0) +
      (data.cleanCup ?? 0) +
      (data.sweetness ?? 0) +
      (data.overall ?? 0)
    );

    const taintPenalty = (data.taint ?? 0) * 2;
    const faultPenalty = (data.fault ?? 0) * 4;
    const totalPenalty = taintPenalty + faultPenalty;

    const finalScore = qualitySum - totalPenalty;

    return finalScore;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/samples/${sample.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save sample');

      const updatedSample = await response.json();
      onUpdate(updatedSample);
    } catch (error) {
      console.error('Error saving sample:', error);
      alert('Failed to save sample. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderNumberInput = (name: string, label: string, min = 0, max = 10, step = 0.25) => {
    const value = formData[name as keyof Sample];
    let displayValue: string | number = '';

    if (value instanceof Date) {
      displayValue = value.toISOString().split('T')[0];
    } else if (value !== undefined && value !== null) {
      displayValue = value;
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type="number"
          name={name}
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-gray-900"
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Sample Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sample ID</label>
            <input
              type="text"
              name="sampleId"
              value={formData.sampleId || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
            <input
              type="text"
              name="origin"
              value={formData.origin || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-gray-900"
              required
            />
          </div>
        </div>

        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Cupping Evaluation</h3>
          {renderNumberInput('fragranceAroma', 'Fragrance/Aroma', 6, 10)}
          {renderNumberInput('flavor', 'Flavor', 6, 10)}
          {renderNumberInput('aftertaste', 'Aftertaste', 6, 10)}
          {renderNumberInput('acidity', 'Acidity', 6, 10)}
          {renderNumberInput('body', 'Body', 6, 10)}
          {renderNumberInput('balance', 'Balance', 6, 10)}
          {renderNumberInput('overall', 'Overall', 6, 10)}

          <div className="pt-2">
            <span className="font-medium">Final Score: </span>
            <span className="font-bold">
              {typeof formData.finalScore === 'number' ? formData.finalScore.toFixed(2) : 'N/A'}
            </span>
          </div>
        </div>

        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Defects</h3>
          {renderNumberInput('primaryDefects', 'Primary Defects', 0, 10, 1)}
          {renderNumberInput('secondaryDefects', 'Secondary Defects', 0, 10, 1)}
          {renderNumberInput('taint', 'Taint', 0, 10, 1)}
          {renderNumberInput('fault', 'Fault', 0, 10, 1)}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tasting Notes</label>
        <textarea
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-gray-900"
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Sample'}
        </button>
      </div>
    </form>
  );
}
