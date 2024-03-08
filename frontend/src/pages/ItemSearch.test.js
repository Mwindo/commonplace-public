import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemSearchPage from "./ItemSearch";
import { LoginContext } from "../components/auth/Auth";
import { ModalContext } from "../components/modals/ModalProvider";
import { BrowserRouter } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GQLQueryContext } from "../components/requests/GQLQueryProvider";
import { MAX_PAGE_SIZE } from "../components/ItemCardList";

// TODO: Some of these tests should be in ItemCardList.test.

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
  useMutation: jest.fn(),
}));

const testItems = (number) => {
  return Array.from({ length: number }, (v, i) => ({
    id: i + 1,
    title: `Test Title ${i + 1}`,
    description: `Test Description ${i + 1}`,
    thumbnail_url: "",
  }));
};

const testTags = ["test tag 1", "test tag 2"];

const testPage = ({
  isAuth,
  numItems = 2,
  showModal = jest.fn(),
  showAlertDialogue = jest.fn(),
}) => {
  useMutation.mockImplementation(() => {
    return {
      isPending: false,
    };
  });
  useQuery.mockImplementation((query) => {
    const queryKey = query.queryKey[0];
    if (queryKey === "items") {
      return {
        isLoading: false,
        isFetching: false,
        error: null,
        data: testItems(numItems),
      };
    } else if (queryKey === "tags") {
      return {
        isLoading: false,
        isFetching: false,
        error: null,
        data: { get_tags: testTags },
      };
    } else {
      return undefined;
    }
  });

  const gqlFetch = jest.fn();

  return (
    <ModalContext.Provider value={{ showModal, showAlertDialogue }}>
      <LoginContext.Provider value={{ isAuth }}>
        <GQLQueryContext.Provider value={gqlFetch}>
          <BrowserRouter>
            <ItemSearchPage />
          </BrowserRouter>
        </GQLQueryContext.Provider>
      </LoginContext.Provider>
    </ModalContext.Provider>
  );
};

it("check item list and items are correctly rendered when isAuth = false", () => {
  const { queryByRole, queryAllByRole } = render(testPage({ isAuth: false }));
  const expectedRoles = ["list", "search", "searchbox"];
  for (const role of expectedRoles) {
    expect(queryByRole(role)).toBeTruthy();
  }
  expect(queryAllByRole("listitem").length === testItems.length);
});

it("check item list and items are correctly rendered when isAuth = true", () => {
  const { queryByRole, queryAllByRole } = render(testPage({ isAuth: true }));
  const expectedRoles = ["list", "search", "searchbox"];
  for (const role of expectedRoles) {
    expect(queryByRole(role)).toBeTruthy();
  }
  // When isAuth, we add an "Add Item" card in addition to the item cards.
  expect(queryAllByRole("listitem").length === testItems.length + 1);
});

const paginateLeftId = "item-card-list-paginate-left";
const paginateRightId = "item-card-list-paginate-right";

it("check no pagination for few elements", () => {
  const { queryByTestId } = render(testPage({ isAuth: false }));
  // There should be no pagination if there aren't enough elements.
  expect(queryByTestId(paginateLeftId)).toBeFalsy();
  expect(queryByTestId(paginateRightId)).toBeFalsy();
});

it("check pagination for multiple elements", async () => {
  const { queryByTestId, getByTestId } = render(
    testPage({ isAuth: false, numItems: MAX_PAGE_SIZE * 2 + 1 })
  );
  // TODO: Make this more dynamic and test multiple numItems.

  // At first, we should be able to paginate right only.
  expect(queryByTestId(paginateLeftId)).toBeFalsy();
  expect(queryByTestId(paginateRightId)).toBeTruthy();

  // After we navigate right, we should be able to paginate left and right.
  await userEvent.click(getByTestId(paginateRightId));
  expect(queryByTestId(paginateLeftId)).toBeTruthy();
  expect(queryByTestId(paginateRightId)).toBeTruthy();

  // After we navigate right again, we should be able to paginate left only.
  await userEvent.click(getByTestId(paginateRightId));
  expect(queryByTestId(paginateLeftId)).toBeTruthy();
  expect(queryByTestId(paginateRightId)).toBeFalsy();

  // After we navigate left, we should again be able to paginate left and right.
  await userEvent.click(getByTestId(paginateLeftId));
  expect(queryByTestId(paginateLeftId)).toBeTruthy();
  expect(queryByTestId(paginateRightId)).toBeTruthy();

  // After we navigate left, we should be back where we started.
  await userEvent.click(getByTestId(paginateLeftId));
  expect(queryByTestId(paginateLeftId)).toBeFalsy();
  expect(queryByTestId(paginateRightId)).toBeTruthy();
});
