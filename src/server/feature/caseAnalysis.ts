import * as shared from "../../shared";
import * as merlin from "../process/merlin";
import { Session } from "../session";
import * as server from "vscode-languageserver";

export function handler(session: Session): server.RequestHandler<shared.types.DocumentRange, Promise<null | merlin.Case.Destruct>, void> {
  return async (event, token) => {
    const start = merlin.Position.fromCode(event.range.start);
    const end = merlin.Position.fromCode(event.range.end);
    const request = merlin.Query.kase.analysis.from(start).to(end);
    const response = await session.merlin.query(request, event.textDocument.uri);
    if (token.isCancellationRequested) return null;
    if (response.class !== "return") throw response.value;
    return response.value;
  };
}