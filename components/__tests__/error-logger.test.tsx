import { render } from "@testing-library/react"
import { ErrorLogger } from "../error-logger"
import { expect, jest, describe, it, beforeEach, afterEach } from "@jest/globals"

describe("ErrorLogger", () => {
  beforeEach(() => {
    // Spy on console.log which is used for error logging in our implementation
    jest.spyOn(console, "log").mockImplementation(() => {})

    // Store original console.error
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders children correctly", () => {
    const { getByText } = render(
      <ErrorLogger>
        <div>Test Child</div>
      </ErrorLogger>,
    )

    expect(getByText("Test Child")).toBeInTheDocument()
  })

  it("logs errors when console.error is called", () => {
    render(
      <ErrorLogger>
        <div>Test</div>
      </ErrorLogger>,
    )

    // Trigger an error
    console.error("Test error")

    // Check if error was logged
    expect(console.log).toHaveBeenCalledWith("[ErrorLogger] Test error")
  })

  it("captures unhandled promise rejections", () => {
    render(
      <ErrorLogger>
        <div>Test</div>
      </ErrorLogger>,
    )

    // Simulate an unhandled promise rejection
    const event = new Event("unhandledrejection") as any
    event.reason = "Test rejection"
    window.dispatchEvent(event)

    // Check if error was logged
    expect(console.log).toHaveBeenCalledWith("[ErrorLogger] Unhandled Promise Rejection: Test rejection")
  })
})
