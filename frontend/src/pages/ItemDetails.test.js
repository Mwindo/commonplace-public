import { render } from "@testing-library/react";
import ItemDetailsPage from "./ItemDetails";
import { BrowserRouter } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GQLQueryContext } from "../components/requests/GQLQueryProvider";

const testItem = {
  id: "1",
  title: "Test Item",
  description: "Test Description",
  tags: ["test tag 1", "test tag 2"],
  content: "Test Content",
};

// Mock useParams since ItemDetails relies on it to get its itemId.
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Import and spread the actual module
  useParams: () => ({
    itemId: testItem.id, // Mocked itemId
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
  useMutation: jest.fn(),
}));

const testPage = () => {
  useQuery.mockImplementation((query) => {
    const queryKey = query.queryKey[0];
    if (queryKey === "itemDetails") {
      return {
        isLoading: false,
        isFetching: false,
        error: null,
        data: testItem,
      };
    } else {
      return undefined;
    }
  });

  const gqlFetch = jest.fn();

  return (
    <GQLQueryContext.Provider value={gqlFetch}>
      <BrowserRouter>
        <ItemDetailsPage />
      </BrowserRouter>
    </GQLQueryContext.Provider>
  );
};

it("check item details displays basic info", () => {
  const { getByRole, queryAllByRole } = render(testPage());
  expect(getByRole("main").innerText === testItem.content);
  expect(getByRole("heading").innerText === testItem.title);
  expect(
    (getByRole("list").children.length ===
      queryAllByRole("listitem").length) ===
      testItem.tags.length
  );
});
