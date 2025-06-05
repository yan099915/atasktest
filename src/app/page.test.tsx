import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";
import Home from "./page";
// Mock fetch global
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("Home Component", () => {
  it("renders input and button", () => {
    render(<Home />);
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("doesn't allow empty search", async () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(await screen.findByText(/Username cannot be empty./i)).toBeInTheDocument();
  });

  it("allows typing into the search input", () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(/enter username/i);
    fireEvent.change(input, { target: { value: "sky" } });

    expect(input).toHaveValue("sky");
  });

  it('searches "sky" and shows 5 users with correct user links', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        items: [
          { id: 1, login: "skywalker", avatar_url: "url1", html_url: "https://github.com/skywalker" },
          { id: 2, login: "skyeagle", avatar_url: "url2", html_url: "https://github.com/skyeagle" },
          { id: 3, login: "skyhigh", avatar_url: "url3", html_url: "https://github.com/skyhigh" },
          { id: 4, login: "skyline", avatar_url: "url4", html_url: "https://github.com/skyline" },
          { id: 5, login: "skyfall", avatar_url: "url5", html_url: "https://github.com/skyfall" },
        ],
      }),
    });

    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
      target: { value: "sky" },
    });

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(screen.getAllByRole("user")).toHaveLength(5);
    });

    const userLinks = screen.getAllByRole("user");
    expect(userLinks[0]).toHaveAttribute("href", "https://github.com/skywalker");
    expect(userLinks[1]).toHaveAttribute("href", "https://github.com/skyeagle");
    expect(userLinks[2]).toHaveAttribute("href", "https://github.com/skyhigh");
    expect(userLinks[3]).toHaveAttribute("href", "https://github.com/skyline");
    expect(userLinks[4]).toHaveAttribute("href", "https://github.com/skyfall");
  });

  it("shows repositories when a user is clicked", async () => {
    // Mock fetch search users
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        items: [{ id: 1, login: "skywalker", avatar_url: "url1", html_url: "https://github.com/skywalker" }],
      }),
    });

    // Mock fetch repositori user "skywalker"
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        { id: 101, name: "repo1", html_url: "https://github.com/skywalker/repo1", watchers: 10, description: "First repo" },
        { id: 102, name: "repo2", html_url: "https://github.com/skywalker/repo2", watchers: 5, description: null },
      ],
    });

    render(<Home />);

    // Search user "skywalker"
    fireEvent.change(screen.getByPlaceholderText(/enter username/i), { target: { value: "skywalker" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => expect(screen.getAllByRole("user")).toHaveLength(1));

    fireEvent.click(screen.getByRole("user"));

    await waitFor(() => {
      expect(screen.queryByText(/loading repositories/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText("repo1")).toBeInTheDocument();
    expect(screen.getByText("repo2")).toBeInTheDocument();

    const repo1Link = screen.getByText("repo1").closest("a");
    expect(repo1Link).toHaveAttribute("href", "https://github.com/skywalker/repo1");

    const repo2Link = screen.getByText("repo2").closest("a");
    expect(repo2Link).toHaveAttribute("href", "https://github.com/skywalker/repo2");

    // Check null description handling
    expect(screen.getByText("No description")).toBeInTheDocument();
  });
});
