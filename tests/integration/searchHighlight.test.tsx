import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Forum from '../../src/pages/forum';
import { BrowserRouter } from 'react-router-dom';
import { usePaginatedQuery, useQuery, useMutation } from 'convex/react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { api } from '../../convex/_generated/api';

jest.mock('convex/react');
jest.mock('@clerk/clerk-react');

const topic = {
  _id: 't1',
  title: 'Apple Banana',
  content: 'Delicious fruit salad',
  category: 'General',
  authorId: 'u1',
  authorName: 'User',
  views: 0,
  likes: 0,
  score: 0,
  isHot: false,
  isPinned: false,
  isLocked: false,
  tags: [],
  hasVideo: false,
  hasImages: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

(usePaginatedQuery as jest.Mock).mockImplementation(() => ({
  results: [topic],
  status: 'Loaded',
  loadMore: jest.fn(),
}));
(useMutation as jest.Mock).mockReturnValue(jest.fn());
(useQuery as jest.Mock).mockReturnValue([]);
(useUser as jest.Mock).mockReturnValue({ user: { id: '1' } });
(useClerk as jest.Mock).mockReturnValue({ signOut: jest.fn() });

it('highlights matched search terms', async () => {
  render(
    <BrowserRouter>
      <Forum />
    </BrowserRouter>
  );

  const input = screen.getByPlaceholderText(/Cari topik/);
  await userEvent.type(input, 'Apple AND Banana');

  expect(screen.getByText('Apple', { selector: 'mark' })).toBeInTheDocument();
  expect(screen.getByText('Banana', { selector: 'mark' })).toBeInTheDocument();
});
