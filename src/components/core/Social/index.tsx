/**
 * SocialLink — odkaz na síť. Varianta "footer" = ikona + tooltip (+ watermark),
 * varianta "contact" = ikona + plný název (v panelu Kontakt).
 */
import Box from "@mui/material/Box";
import type { Social } from "../../../data/socials";
import * as styles from "./styles";

type Props = { social: Social; variant?: "footer" | "contact" };

export default function SocialLink({ social, variant = "footer" }: Props) {
  const contact = variant === "contact";
  return (
    <Box component="a" href={social.url} target="_blank" rel="noopener noreferrer"
      aria-label={social.name} sx={styles.link(contact)}>
      {!contact && <Box component="span" className="sim-tip">{social.name}</Box>}
      {social.icon}
      {contact
        ? <Box component="span" sx={styles.watermark(true)}>{social.name}</Box>
        : social.wm && <Box component="span" sx={styles.watermark(false)}>{social.wm}</Box>}
    </Box>
  );
}
