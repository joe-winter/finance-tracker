import { mockRequest, mockResponse } from "../../__mocks__";
import UsersController from "../../handlers/users";


describe("getUsers", () => {
  it("should return an array of users", () => {
    UsersController.getUserById(mockRequest, mockResponse);

    expect(mockResponse.send).toHaveBeenCalledWith({})
  });
});
