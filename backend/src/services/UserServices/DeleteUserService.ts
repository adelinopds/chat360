import User from "../../models/User";
import AppError from "../../errors/AppError";
import Ticket from "../../models/Ticket";
import UpdateDeletedUserOpenTicketsStatus from "../../helpers/UpdateDeletedUserOpenTicketsStatus";

const DeleteUserService = async (
  id: string | number,
  tenantId: string | number
): Promise<void> => {
  const user = await User.findOne({
    where: { id, tenantId }
  });

  if (!user || tenantId !== user.tenantId) {
    throw new AppError("ERR_NO_USER_FOUND", 404);
  }

  const userOpenTickets: Ticket[] = await user.$get("tickets", {
    where: { status: "open", tenantId }
  });

  if (userOpenTickets.length > 0) {
    UpdateDeletedUserOpenTicketsStatus(userOpenTickets, tenantId);
  }

  await user.destroy();
};

export default DeleteUserService;