import { TranslateFunction } from "@refinedev/core/dist/interfaces/bindings/i18n";
import { confirmDialog } from "primereact/confirmdialog";

interface ConfirmDialogOptions {
  message?: string;
  header?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptClassName?: string;
  accept: any;
  reject: any;
}

type ConfirmDialogProps = {
  options: ConfirmDialogOptions;
  t: TranslateFunction;
};

export const showWarningConfirmDialog = ({
  options,
  t,
}: ConfirmDialogProps) => {
  confirmDialog({
    message: options.message || t("confirmDialog.edit.message"),
    header: options.header || t("confirmDialog.edit.header"),
    icon: options.icon || "pi pi-exclamation-triangle",
    acceptLabel: options.acceptLabel || t("confirmDialog.edit.acceptLabel"),
    rejectLabel: options.rejectLabel || t("confirmDialog.edit.rejectLabel"),
    acceptClassName: options.acceptClassName || "p-button-warning",
    accept: () => {
      options.accept();
    },
    reject: () => {
      if (options.reject) {
        options.reject();
      }
    },
  });
};

export const showDangerConfirmDialog = ({ options, t }: ConfirmDialogProps) => {
  confirmDialog({
    message: options.message || t("confirmDialog.delete.message"),
    header: options.header || t("confirmDialog.delete.header"),
    icon: options.icon || "pi pi-info-circle",
    acceptLabel: options.acceptLabel || t("confirmDialog.delete.acceptLabel"),
    rejectLabel: options.rejectLabel || t("confirmDialog.delete.rejectLabel"),
    acceptClassName: options.acceptClassName || "p-button-danger",
    accept: () => {
      options.accept();
    },
    reject: () => {
      if (options.reject) {
        options.reject();
      }
    },
  });
};
