// __mocks__/clerk.js
export const ClerkProvider = ({ children }) => children;
export const useUser = () => ({
  user: { id: "test-id", username: "test-user" },
  signOut: jest.fn(),
});
