import type { ComponentProps } from "react";
import Theme, { getCustomMDXComponent } from "rspress/theme";

const defaults = getCustomMDXComponent();
const DefaultLink = defaults.a;
function AccessibleLink(props: ComponentProps<"a">) {
	const anchor = props.className?.includes("header-anchor");
	return (
		<DefaultLink
			{...props}
			aria-hidden={anchor ? undefined : props["aria-hidden"]}
			aria-label={
				anchor
					? `链接到：${decodeURIComponent(props.href?.slice(1) ?? "")}`
					: props["aria-label"]
			}
		/>
	);
}
function AccessibleCode({
	children = "",
	...rest
}: Partial<ComponentProps<typeof defaults.code>>) {
	const props = { ...rest, children };
	if (!props.className) return <defaults.code {...props} />;
	return (
		<div
			ref={(element) => {
				// Prism owns the inner pre. Give its scroll region a keyboard focus target.
				element?.querySelectorAll("pre").forEach((pre) => {
					pre.tabIndex = 0;
				});
			}}
		>
			<defaults.code {...props} />
		</div>
	);
}
function Layout() {
	return (
		<Theme.Layout components={{ a: AccessibleLink, code: AccessibleCode }} />
	);
}
export default { ...Theme, Layout };
export * from "rspress/theme";
