import { createAccountCopy } from "../../_constants/create-account.constants";

export function CreateAccountHeader() {
  return (
    <div className="text-center">
      <h1 className="mt-2 text-2xl font-semibold tracking-normal xl:mt-4 2xl:text-3xl">
        {createAccountCopy.title}
      </h1>
      <p className="hidden 2xl:block mt-2 text-sm leading-6 text-muted-foreground">
        {createAccountCopy.description}
      </p>
    </div>
  );
}
