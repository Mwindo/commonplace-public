import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemCard from "./ItemCard";
import { LoginContext } from "./auth/Auth";
import { ModalContext } from "./modals/ModalProvider";
import { BrowserRouter } from "react-router-dom";

const testItemCard = ({
  isAuth,
  showModal = jest.fn(),
  showAlertDialogue = jest.fn(),
}) => {
  return (
    <ModalContext.Provider value={{ showModal, showAlertDialogue }}>
      <LoginContext.Provider value={{ isAuth }}>
        <BrowserRouter>
          <ItemCard
            itemId={1}
            itemImage=""
            itemTitle="Test Card"
            itemDescription="Test Description"
          />
        </BrowserRouter>
      </LoginContext.Provider>
    </ModalContext.Provider>
  );
};

it("check no edit buttons appear if not isAuth", () => {
  const { asFragment, queryByRole } = render(testItemCard({ isAuth: false }));
  expect(asFragment()).toMatchSnapshot();
  expect(queryByRole("menubar")).toBeFalsy();
});

it("check edit buttons appear if isAuth", () => {
  const { asFragment, queryByRole } = render(testItemCard({ isAuth: true }));
  expect(asFragment()).toMatchSnapshot();
  expect(queryByRole("menubar")).toBeTruthy();
});

it("check edit modal appears when edit clicked", async () => {
  let modalShown = false;
  const showModal = () => {
    modalShown = true;
  };
  const { getByText } = render(testItemCard({ isAuth: true, showModal }));
  await userEvent.click(getByText("Edit"));
  expect(modalShown).toBeTruthy();
});

it("check delete modal appears when delete clicked", async () => {
  let modalShown = false;
  const showModal = () => {
    modalShown = true;
  };
  const { getByText } = render(testItemCard({ isAuth: true, showModal }));
  await userEvent.click(getByText("Delete"));
  expect(modalShown).toBeTruthy();
});
