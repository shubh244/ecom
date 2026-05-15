<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Copies application tables from PostgreSQL (e.g. Supabase) into the default MySQL connection.
 *
 * Requires PHP extensions: pdo_mysql, pdo_pgsql.
 * Run on a machine that can reach both databases (often your PC with Remote MySQL enabled on Hostinger).
 */
class ImportDataFromSupabase extends Command
{
    protected $signature = 'db:import-from-supabase
                            {--force : Truncate target application tables on MySQL before import (destructive)}';

    protected $description = 'Copy categories, products, users, orders, and related tables from import_source (pgsql) to default (mysql)';

    /** @var list<string> */
    private const TRUNCATE_ORDER = [
        'order_payment_screenshots',
        'order_items',
        'order_payments',
        'orders',
        'products',
        'categories',
        'personal_access_tokens',
        'password_reset_tokens',
        'sessions',
        'users',
    ];

    /** @var list<string> */
    private const COPY_ORDER = [
        'categories',
        'products',
        'users',
        'orders',
        'order_items',
        'order_payments',
        'order_payment_screenshots',
    ];

    public function handle(): int
    {
        $default = config('database.default');
        $defaultDriver = config("database.connections.{$default}.driver");

        if ($defaultDriver !== 'mysql' && $defaultDriver !== 'mariadb') {
            $this->error('Default DB connection must be mysql or mariadb (Hostinger target). Got: '.$defaultDriver);

            return self::FAILURE;
        }

        try {
            DB::connection('import_source')->getPdo();
        } catch (\Throwable $e) {
            $this->error('Cannot connect to import_source (PostgreSQL). Check IMPORT_SOURCE_DB_* in .env and pdo_pgsql.');
            $this->line($e->getMessage());

            return self::FAILURE;
        }

        foreach (self::COPY_ORDER as $table) {
            if (! Schema::connection('import_source')->hasTable($table)) {
                $this->error("Source missing table [{$table}]. Migrations may differ from production.");

                return self::FAILURE;
            }
            if (! Schema::hasTable($table)) {
                $this->error("Target missing table [{$table}]. Run: php artisan migrate --force on MySQL first.");

                return self::FAILURE;
            }
        }

        if (! $this->option('force')) {
            $this->warn('This will INSERT into MySQL tables (duplicates may error if data already exists).');
            $this->warn('Use --force to TRUNCATE application tables on MySQL first (destructive).');
            if (! $this->option('no-interaction') && ! $this->confirm('Continue without truncating?', false)) {
                return self::SUCCESS;
            }
        } else {
            if (! $this->option('no-interaction') && ! $this->confirm('--force will DELETE existing rows in application tables on MySQL. Continue?', false)) {
                return self::SUCCESS;
            }
            $this->truncateMysqlTargets();
        }

        Schema::disableForeignKeyConstraints();
        try {
            foreach (self::COPY_ORDER as $table) {
                $n = $this->copyTable($table);
                $this->info("Copied [{$table}]: {$n} rows");
            }
        } finally {
            Schema::enableForeignKeyConstraints();
        }

        $this->copyOptionalTable('personal_access_tokens');

        $this->newLine();
        $this->info('Done. Remove IMPORT_SOURCE_DB_* from .env when finished, then run: php artisan config:clear');

        return self::SUCCESS;
    }

    private function truncateMysqlTargets(): void
    {
        Schema::disableForeignKeyConstraints();
        try {
            foreach (self::TRUNCATE_ORDER as $table) {
                if (Schema::hasTable($table)) {
                    DB::table($table)->truncate();
                    $this->line("Truncated [{$table}]");
                }
            }
        } finally {
            Schema::enableForeignKeyConstraints();
        }
    }

    private function copyTable(string $table): int
    {
        $query = DB::connection('import_source')->table($table);
        $dst = DB::table($table);
        if (Schema::connection('import_source')->hasColumn($table, 'id')) {
            $query->orderBy('id');
        }

        $count = 0;
        $batch = [];
        foreach ($query->cursor() as $row) {
            $batch[] = $this->normalizeRow((array) $row);
            if (count($batch) >= 200) {
                $dst->insert($batch);
                $count += count($batch);
                $batch = [];
            }
        }
        if ($batch !== []) {
            $dst->insert($batch);
            $count += count($batch);
        }

        return $count;
    }

    private function copyOptionalTable(string $table): void
    {
        if (! Schema::connection('import_source')->hasTable($table) || ! Schema::hasTable($table)) {
            return;
        }
        $n = $this->copyTable($table);
        if ($n > 0) {
            $this->info("Copied [{$table}]: {$n} rows");
        }
    }

    /**
     * @param  array<string, mixed>  $row
     * @return array<string, mixed>
     */
    private function normalizeRow(array $row): array
    {
        foreach ($row as $k => $v) {
            if ($v instanceof \DateTimeInterface) {
                $row[$k] = $v->format('Y-m-d H:i:s');
            } elseif (is_string($v) && ($v === 't' || $v === 'f')) {
                // Rare: some PG drivers return bool as char
                $row[$k] = $v === 't' ? 1 : 0;
            } elseif (is_resource($v)) {
                $row[$k] = stream_get_contents($v) ?: '';
            }
        }

        return $row;
    }
}
