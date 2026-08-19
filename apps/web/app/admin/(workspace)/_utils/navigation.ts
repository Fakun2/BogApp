export function isAdminRouteActive(pathname: string, href: string) {
  const pathnamePath = pathname.split("?")[0] ?? pathname;
  const hrefParts = href.split("?");
  const hrefPath = hrefParts[0] ?? href;
  const hrefQuery = hrefParts[1];

  if (hrefQuery) {
    return pathname === href;
  }

  if (hrefPath === "/admin") {
    return pathnamePath === hrefPath;
  }

  return (
    pathnamePath === hrefPath ||
    pathnamePath.startsWith(`${hrefPath}/`) ||
    pathname.startsWith(`${hrefPath}?`)
  );
}
