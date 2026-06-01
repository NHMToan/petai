import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../../components/ui/DataTable";
import { GlassCard } from "../../components/ui/GlassCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatePanel } from "../../components/ui/StatePanel";
import { useI18n } from "../../features/i18n/i18n-context";
import { formatVndFromUsd } from "../../lib/currency";
import { fetchAdminOrders } from "../../lib/api/admin";
import type { Order, TableColumn } from "../../types";

export function AdminOrdersPage() {
  const { locale, t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminOrders()
      .then((data) => setOrders(data))
      .catch((nextError) => setError(nextError instanceof Error ? nextError.message : "Unable to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo<TableColumn<Order>[]>(
    () => [
      {
        key: "orderNumber",
        header: "ORDER",
        render: (row) => (
          <div>
            <div className="font-semibold text-on-surface">{row.orderNumber}</div>
            <div className="mono-label text-primary">{row.source}</div>
          </div>
        ),
      },
      {
        key: "customerName",
        header: "CUSTOMER",
        render: (row) => (
          <div>
            <div className="font-semibold text-on-surface">{row.customerName}</div>
            <div className="text-xs text-on-surface-variant">{row.customerEmail}</div>
            {row.customerPhone ? <div className="text-xs text-on-surface-variant">{row.customerPhone}</div> : null}
          </div>
        ),
      },
      {
        key: "items",
        header: "ITEMS",
        render: (row) => (
          <div className="space-y-1">
            {row.items.map((item) => (
              <div className="text-xs text-on-surface-variant" key={item.id}>
                <span className="text-on-surface">{item.productName}</span> x {item.quantity}
              </div>
            ))}
          </div>
        ),
      },
      {
        key: "shippingLine1",
        header: "SHIPPING",
        render: (row) => (
          <div className="text-xs text-on-surface-variant">
            <div>{row.shippingLine1}</div>
            {row.shippingLine2 ? <div>{row.shippingLine2}</div> : null}
            <div>{[row.city, row.state, row.postalCode, row.country].filter(Boolean).join(", ")}</div>
          </div>
        ),
      },
      {
        key: "total",
        header: "TOTAL",
        render: (row) => (
          <div>
            <div className="font-mono text-primary">{formatVndFromUsd(row.total, locale === "vn" ? "vi-VN" : "en-US")}</div>
            <div className="text-xs text-on-surface-variant">{row.status}</div>
          </div>
        ),
      },
      {
        key: "createdAt",
        header: "CREATED",
        render: (row) => <span className="text-xs text-on-surface-variant">{row.createdAt ? new Date(row.createdAt).toLocaleString() : "--"}</span>,
      },
    ],
    [locale],
  );

  return (
    <div>
      <PageHeader
        description="Review customer checkout details coming from website and mobile orders."
        title="Orders"
      />

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <GlassCard className="p-6">
          <div className="mono-label mb-2 text-primary">TOTAL ORDERS</div>
          <div className="text-3xl font-bold">{orders.length}</div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="mono-label mb-2 text-primary">PENDING</div>
          <div className="text-3xl font-bold">{orders.filter((order) => order.status === "PENDING").length}</div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="mono-label mb-2 text-primary">REVENUE</div>
          <div className="text-3xl font-bold">{formatVndFromUsd(orders.reduce((sum, order) => sum + order.total, 0), locale === "vn" ? "vi-VN" : "en-US")}</div>
        </GlassCard>
      </div>

      {loading ? <div className="mb-8"><StatePanel message="Loading order queue." title="Loading orders" /></div> : null}
      {error ? <div className="mb-8"><StatePanel message={error} title="Could not load orders" tone="error" /></div> : null}

      <DataTable columns={columns} rows={orders} />
    </div>
  );
}
