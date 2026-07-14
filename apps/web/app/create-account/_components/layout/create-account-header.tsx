import { createAccountCopy } from "../../_constants/create-account.constants";

export function CreateAccountHeader() {
  return (
    <div className="text-center">
      <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">
        {createAccountCopy.title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {createAccountCopy.description}
      </p>
    </div>
  );
}
