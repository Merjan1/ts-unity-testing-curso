import React from "react";
import * as ReactDOM from "react-dom";
import { fireEvent, waitFor } from "@testing-library/react";

import { Login } from "./login";
import { LoginService } from "./services/LoginService";

jest.mock("./services/LoginService");

describe("Login component tests", () => {
  let container: HTMLDivElement;

  const loginServiceSpy = jest.spyOn(LoginService.prototype, "login");

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    ReactDOM.render(<Login />, container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  test("Renders correctly initial document", () => {
    const inputs = container.querySelectorAll("input");

    expect(inputs).toHaveLength(3);
    expect(inputs[0].name).toBe("login");
    expect(inputs[1].name).toBe("password");
    container.querySelector("label");
    expect(inputs[2].value).toBe("Login");

    const label = container.querySelector("label");

    expect(label).not.toBeInTheDocument();
  });

  test("Renders correctly initial document with data-test query", () => {
    expect(
      container.querySelector("[data-test='login-form']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-test='login-input']")?.getAttribute("name")
    ).toBe("login");
    expect(
      container
        .querySelector("[data-test='password-input']")
        ?.getAttribute("name")
    ).toBe("password");
  });

  test.only("Passes credentials correctly", () => {
    const inputs = container.querySelectorAll("input");
    const loginInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(loginInput, { target: { value: "someUser" } });
    fireEvent.change(passwordInput, { target: { value: "somePass" } });
    fireEvent.click(loginButton);

    expect(loginServiceSpy).toBeCalledWith("someUser", "somePass");
  });

  test("Renders correctly status label - invalid login", async () => {
    loginServiceSpy.mockResolvedValueOnce(false);

    const inputs = container.querySelectorAll("input");
    const loginButton = inputs[2];

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(container.querySelector("label")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(container.querySelector("label")).toHaveTextContent(
        "Login failed"
      );
    });
  });

  test("Renders correctly status label - valid login", async () => {
    loginServiceSpy.mockResolvedValueOnce(true);

    const inputs = container.querySelectorAll("input");
    const loginButton = inputs[2];

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(container.querySelector("label")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(container.querySelector("label")).toHaveTextContent(
        "Login successful"
      );
    });
  });
});
