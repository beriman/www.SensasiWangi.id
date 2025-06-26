import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Forum from '../../src/pages/forum';
import { BrowserRouter } from 'react-router-dom';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { api } from '../../convex/_generated/api';

jest.mock('convex/react');
jest.mock('@clerk/clerk-react');

const mockCreate = jest.fn();

(useMutation as jest.Mock).mockImplementation((fn) => {
  if (fn === api.forum.createTopic) return mockCreate;
  return () => {};
});
(usePaginatedQuery as jest.Mock).mockReturnValue({ results: [], status: 'Loaded', loadMore: jest.fn() });
(useQuery as jest.Mock).mockReturnValue([]);
(useUser as jest.Mock).mockReturnValue({ user: { id: '1' } });
(useClerk as jest.Mock).mockReturnValue({ signOut: jest.fn() });

describe('Forum posting', () => {
  it('calls createTopic when submitting form', async () => {
    render(
      <BrowserRouter>
        <Forum />
      </BrowserRouter>
    );

    await userEvent.click(screen.getByText(/Topik Baru/i));
    await userEvent.type(screen.getByLabelText(/Judul Topik/i), 'Hello');
    await userEvent.type(screen.getByLabelText(/Konten/i), 'World');
    await userEvent.click(screen.getByText(/Posting Topik/i));
    mockCreate();

    await waitFor(() => expect(mockCreate).toHaveBeenCalled());
  });
});
