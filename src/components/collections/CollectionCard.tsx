'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Folder, Calendar, Users } from 'lucide-react';
import { deleteCollection } from '@/lib/actions/collections';

interface Collection {
  id: string;
  name: string;
  created_at: string;
  item_count: number;
}

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    const confirmed = window.confirm(
      `Are you sure you want to delete "${collection.name}"? This will remove all ${collection.item_count} compan${collection.item_count === 1 ? 'y' : 'ies'} from this collection.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteCollection(collection.id);
      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      console.error('Failed to delete collection:', error);
      alert('Failed to delete collection. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/collections/${collection.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="p-6">
        {/* Header with icon and delete button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Folder className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {collection.name}
            </h3>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting || isPending}
            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            title="Delete collection"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Meta information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Created on {formatDate(collection.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Users className="h-4 w-4" />
            <span>
              {collection.item_count} lead{collection.item_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Footer with action hint */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
          Click to view details →
        </span>
      </div>
    </div>
  );
}
