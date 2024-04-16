interface FormComponentsStyles {
  imageUpload: React.CSSProperties;
  avatar: React.CSSProperties;
  imageDescription: React.CSSProperties;
  imageValidation: React.CSSProperties;
}

export const styles: FormComponentsStyles = {
  imageUpload: {
    border: "none",
    width: "100%",
    background: "none",
  },
  avatar: {
    width: "100%",
    height: "100%",
    maxWidth: "200px",
  },
  imageDescription: {
    fontWeight: 800,
    fontSize: "16px",
    marginTop: "8px",
  },
  imageValidation: {
    fontSize: "12px",
  },
};
